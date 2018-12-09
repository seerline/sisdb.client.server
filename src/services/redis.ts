import Boom from 'boom'
import debug from 'debug'
import Redis, { RedisOptions } from 'ioredis'
import { Context } from 'koa'

const redisDebug = debug('redis:connect')

export interface LoginOptions extends RedisOptions {
  label: string
}

export interface RedisCliet extends Redis.Redis {
  label: string
  options: RedisOptions
}

export const redisConnections: RedisCliet[] = []

export async function connectRedis (options: RedisOptions) {
  const redis = new Redis(options)
  return new Promise((resolve, reject) => {
    redis
      .on('ready', () => {
        redisDebug(
          `redis connected on ${options.host}:${options.port}`,
        )
        resolve(redis)
      })
      .on('error', (error: Error) => {
        redisDebug(error.message)
        reject(error)
      })
  })
}

export async function login ({ label, ...redisOptions }: LoginOptions) {
  return new Promise((resolve, reject) => {
    redisDebug(`connecting... ${label}, ${JSON.stringify(redisOptions)}`)
    const client = new Redis({
      connectionName: 'redis-commander',
      ...redisOptions,
    }) as RedisCliet
    client.label = label
    client.options = redisOptions

    let isPushed = false
    client.on('error', function (err) {
      redisDebug('Redis error', err.stack)
      if (!isPushed) {
        redisDebug('Quiting Redis')
        client.quit()
        client.disconnect()
      }
      reject(err)
    })
    client.on('end', function () {
      redisDebug('Connection closed. Attempting to Reconnect...')
    })
    client.on('connect', function selectDatabase () {
      const dbIndex = redisOptions.db || 0

      return client.select(dbIndex, function (err) {
        if (err) {
          redisDebug('could not select database', err.stack)
          return reject(err)
        }
        redisDebug('Using Redis DB #' + dbIndex)
        redisConnections.push(client)
        isPushed = true
        resolve(client)
      })
    })
  })
}

export async function logout (hostname: string, port: string | number, db: number) {
  return new Promise((resolve, reject) => {
    let notRemoved = true
    redisConnections.forEach(function (instance, index) {
      const options = instance.options
      if (notRemoved && options.host === hostname && options.port === port && options.db === db) {
        notRemoved = false
        const connectionToClose = redisConnections.splice(index, 1)
        connectionToClose[0].quit()
      }
    })
    if (notRemoved) {
      reject(`Could not remove , ${hostname}, ${port}.`)
    } else {
      resolve()
    }
  })
}

export function getClientByConnectionId(ctx: Context, connectionId: string) {
  if (connectionId) {
    const connectionIds = connectionId.split(':')
    const desiredHost = connectionIds[0] || ''
    const desiredPort = parseInt(connectionIds[1], 10)
    const desiredDb = parseInt(connectionIds[2], 10)
    const con = redisConnections.find(function (connection) {
      return (connection.options.host === desiredHost && connection.options.port === desiredPort && connection.options.db === desiredDb)
    })
    if (con) {
      ctx.redisClient = con
    } else {
      throw Boom.badRequest(`Not found connection: ${connectionId}`)
    }
  }
}
