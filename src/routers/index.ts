import { Context } from 'koa'
import Router from 'koa-router'
import { postLogin, postLogout } from '../controllers/home'
import { redisConnections } from '../utils/redis'
import api from './apiv1'
import toolRouter from './tools'

const getConnection = async (connectionId: string, ctx: Context, next: () => Promise<any>) => {
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
    }
  }
  await next()
}

const router = new Router()

router
  .param('connectionId', getConnection)
  .use('/api', api.routes(), api.allowedMethods())
  .use('/tools', toolRouter.routes(), toolRouter.allowedMethods())

// router.get('/connections', getConnections)
router.post('/login', postLogin)
// router.get('/config', getConfig);
// router.post('/config', postConfig);
router.post('/logout/:connectionId', postLogout)

export default router
