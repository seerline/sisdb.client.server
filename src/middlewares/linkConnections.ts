import { Middleware } from 'koa'
import { redisConnections } from '../utils/redis'

export default (): Middleware => async (ctx, next) => {
  ctx.redisConnections = redisConnections
  await next()
}
