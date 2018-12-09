import { RedisOptions } from 'ioredis'

export const redisOptions = [{
  label: 'label',
  host: 'localhost',
  port: 6379,
  db: 0
}, {
  label: 'label1',
  host: 'localhost',
  port: 16379,
  db: 0
}]

export function buildConnectionId (options: RedisOptions) {
  return `${options.host}:${options.port}:${options.db}`
}
