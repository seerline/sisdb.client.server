import Boom from 'boom'
import { Middleware } from 'koa'
import { jwtVerify } from '../services/jwt'

export default (): Middleware => async (ctx, next) => {
  let token
  if (ctx.request.body && ctx.request.body.access_token) {
    token = ctx.request.body.access_token
  } else if (ctx.request.query.access_token) {
    token = ctx.request.query.access_token
  } else {
    const authorization = `${ctx.request.get('Authorization') || ''}`.split(/\s+/)
    if (/^Bearer$/i.test(authorization[0])) {
      token = `${authorization[1] || ''}`
    }
  }

  if (!token) {
    throw Boom.unauthorized('Unauthorized - Missing Token')
  }
  const verify = await jwtVerify(token)
  if (verify) {
    console.info('authorized')
    await next()
  } else {
    throw Boom.unauthorized('Unauthorized - Token Invalid or Expired')
  }
}
