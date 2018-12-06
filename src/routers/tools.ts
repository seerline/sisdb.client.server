import Router from 'koa-router'
import { exportData, importData } from '../controllers/tools'

const userRouter = new Router()

userRouter
  .get('/export', exportData)
  .post('/import', importData)

export default userRouter
