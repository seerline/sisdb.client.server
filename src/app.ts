import cors from 'kcors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import errorHandle from './middlewares/errorHandle'
import linkConnections from './middlewares/linkConnections'
import routers from './routers'

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(errorHandle())
app.use(linkConnections())
app.use(cors())
app.use(routers.routes())
app.use(routers.allowedMethods())

export default app
