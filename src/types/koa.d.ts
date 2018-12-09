import Redis from 'ioredis'
import { RedisCliet } from '../services/redis'


declare module 'koa' {
  interface Application {
  }
  interface Context {
    redisClient: RedisCliet
    redisConnections: RedisCliet[]
  }
}