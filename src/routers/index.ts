import { Context } from 'koa'
import Router from 'koa-router'
import { getClientByConnectionId } from '../services/redis'
import api from './apiv1'
import homeRouter from './home'
import toolRouter from './tools'

const getConnection = async (connectionId: string, ctx: Context, next: () => Promise<any>) => {
  getClientByConnectionId(ctx, connectionId)
  await next()
}
const getConnectionFromQueryOrBody = async (ctx: Context, next: () => Promise<any>) => {
  const connectionId = ctx.query.connectionId || (ctx.request.body && ctx.request.body.connectionId) || ''
  getClientByConnectionId(ctx, connectionId)
  await next()
}

const router = new Router()

router
  .param('connectionId', getConnection)
  .use(getConnectionFromQueryOrBody)
  .use('/', homeRouter.routes(), homeRouter.allowedMethods())
  .use('/api', api.routes(), api.allowedMethods())
  .use('/tools', toolRouter.routes(), toolRouter.allowedMethods())

export default router
