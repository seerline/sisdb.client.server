import Koa from 'koa'
import cors from 'kcors'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import routers from './routers'
import errorHandle from './middlewares/errorHandle'

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(errorHandle())
app.use(cors())
app.use(routers.routes())
app.use(routers.allowedMethods())

export default app
