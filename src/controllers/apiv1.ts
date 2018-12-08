import inflection from 'inflection'
import { RedisOptions } from 'ioredis'
import { Context, Middleware } from 'koa'
import { RedisCliet } from '../utils/redis'

export const getTest: Middleware = async (ctx: Context) => {
  ctx.body = 'hello'
}

interface ConnectionInfo extends RedisOptions {
  label: string
  info?: Array<{key: string, value: string}>
  error?: string
}
async function getServerInfo (redisConnection: RedisCliet) {
  const connectionInfo: ConnectionInfo = {
    label: redisConnection.label,
    host: redisConnection.options.host,
    port: redisConnection.options.port,
    db: redisConnection.options.db,
  }
  try {
    const serverInfo = await redisConnection.info()
    const infoLines = serverInfo
    .split('\n')
    .map(function (line) {
      line = line.trim()
      const parts = line.split(':')
      return {
        key: inflection.humanize(parts[0]),
        value: parts.slice(1).join(':'),
      }
    })
    connectionInfo.info = infoLines
  } catch (error) {
    if (error) {
      console.error('getServerInfo', error)
      connectionInfo.error = error.message
    }
  }
  return connectionInfo
}

export const getServersInfo: Middleware = async (ctx: Context) => {
  const redisConnections = ctx.redisConnections || []
  const allServerInfo: ConnectionInfo[] = []
  for (const redisConnection of redisConnections) {
    const serverInfo = await getServerInfo(redisConnection)
    allServerInfo.push(serverInfo)
    allServerInfo.push(serverInfo)
  }
  ctx.body = allServerInfo
}

export const isConnected: Middleware = async (ctx: Context) => {
  let connected = false
  if (ctx.redisClient) {
    const data = await ctx.redisClient.info()
    connected = !!data
  }
  ctx.body = connected
}
