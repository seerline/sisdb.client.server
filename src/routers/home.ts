import Router from 'koa-router'
import { postLogin, postLogout } from '../controllers/home'

const router = new Router()

router
  // .get('/connections', getConnections)
  .post('login', postLogin)
  // .get('/config', getConfig);
  // .post('/config', postConfig);
  .post('logout/:connectionId', postLogout)

export default router
