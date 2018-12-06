import Router from 'koa-router'
import api from './apiv1'
import toolRouter from './tools'

const router = new Router()

router
  .use('/api', api.routes(), api.allowedMethods())
  .use('/tools', toolRouter.routes(), toolRouter.allowedMethods())

// router.get('/connections', exportData)
// router.post('/login', postLogin);
// router.get('/config', getConfig);
// router.post('/config', postConfig);
// router.post('/logout/:connectionId', postLogout);

export default router
