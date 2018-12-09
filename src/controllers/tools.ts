import Boom from 'boom'
import { Context, Middleware } from 'koa'

export const exportData: Middleware = async (ctx: Context) => {
  const exportType = ctx.query.key || ''
  try {
    const data = await ctx.redisClient.dump(exportType)
    ctx.set('Content-disposition', 'attachment; filename=db.' + (new Date().getTime()) + '.redis')
    ctx.set('Content-Type', 'application/octet-stream')
    switch (exportType) {
      case 'json':
        ctx.body = JSON.stringify(data)
        break
      default:
        ctx.body = data
        break
    }
  } catch (error) {
    throw Boom.badImplementation(error.message)
  }
}

export const importData: Middleware = async (ctx: Context) => {
  try {
    const data = await ctx.redisClient.restore(ctx.body.data)
    ctx.body = data
  }  catch (e) {
    console.error('Could\'t not import redis data! Exception:', e)
    ctx.body = {inserted: 0, errors: -1, status: 'FAIL', message: 'Exception processing inport data'}
  }
}
