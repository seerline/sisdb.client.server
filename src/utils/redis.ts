import Redis, { RedisOptions } from 'ioredis'
import debug from 'debug'
import config from '../config'

const redisDebug = debug('redis:connect')

const redisConnections: Redis.Redis[] = []

export async function connectRedis (options: RedisOptions) {
  const redis = new Redis(options)
  return new Promise((resolve, reject) => {
    redis
      .on('ready', () => {
        redisDebug(
          `redis connected on ${options.host}:${options.port}`
        )
        resolve(redis)
      })
      .on('error', (error: Error) => {
        redisDebug(error.message)
        reject(error)
      })
  })
}

export interface LoginOptions extends RedisOptions {
  label: string
}

export interface RedisCliet extends Redis.Redis {
  label: string
}

export async function login ({ label, ...redisOptions }: LoginOptions) {
  return new Promise((resolve, reject) => {
    redisDebug(`connecting... ${label}, ${JSON.stringify(redisOptions)}`)
    const client = new Redis({
      connectionName: 'redis-commander',
      ...redisOptions
    }) as RedisCliet
    client.label = label
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
      let dbIndex = redisOptions.db || 0

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
      // Todo
      const options = (instance as any).options
      if (notRemoved && options.host === hostname && options.port === port && options.db === db) {
        notRemoved = false
        let connectionToClose = redisConnections.splice(index, 1)
        connectionToClose[0].quit()
      }
    })
    if (notRemoved) {
      throw new Error(`Could not remove , ${hostname}, ${port}.`)
    } else {
      return
    }
  })
}

export async function connectAllRedisClients () {
  for (const option of config.redises) {
    try {
      const client = await connectRedis(option) as Redis.Redis
      redisConnections.push(client)
    } catch (error) {
      redisDebug(error)
    }
  }
}
