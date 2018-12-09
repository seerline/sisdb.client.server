import { Middleware } from 'koa'
import { redisConnections } from '../services/redis'

export default (): Middleware => async (ctx, next) => {
  ctx.redisConnections = redisConnections
  await next()
}
