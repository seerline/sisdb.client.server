import Boom from 'boom'
import { Context, Middleware } from 'koa'
import * as myUtils from '../utils'
import { login, logout, redisConnections } from '../utils/redis'

export const exportData: Middleware = async (ctx: Context) => {
  ctx.body = { success: true, message: 'success', result: [
    { name: 'michael' },
    { name: 'joyce' },
  ] }
}

export const getConnections: Middleware = async (ctx: Context) => {
  const connections = redisConnections.map((connection) => {
    return {
      label: connection.label,
      options: {
        host: connection.options.host,
        port: connection.options.port,
        db: connection.options.db,
      },
    }
  })
  ctx.body = {
    connections,
  }
}

export const postLogin: Middleware = async (ctx: Context) => {
  // first check if this connection is already know & active - do not create duplicate connections
  const reqBody = ctx.request.body
  const newConnection = {
    label: reqBody.label,
    host: reqBody.host,
    port: parseInt(reqBody.port, 10),
    password: reqBody.password,
    db: parseInt(reqBody.db, 10),
  }
  if (myUtils.containsConnection(redisConnections.map((c) => c.options), newConnection)) {
    return ctx.body = {
      ok: true,
      message: 'Logged',
    }
  }

  // now try to login
  try {
    await login(newConnection)
    ctx.body = {
      ok: true,
    }
  } catch (error) {
    console.info(error)
    throw Boom.badImplementation('Connect error')
  }
}

export const postLogout: Middleware = async (ctx: Context) => {
  const { options } = ctx.redisClient

  if (!options) {
    throw Boom.badRequest('Params_error')
  }
  if (myUtils.containsConnection(redisConnections.map((c) => c.options), options) === false) {
    throw Boom.notFound('Not_Found_Connection', options)
  }

  // now try to login
  try {

    await logout(options.host || '', options.port || 0, options.db || 0)
    ctx.body = {
      ok: true,
    }
  } catch (error) {
    throw Boom.badImplementation('DisConnect error')
  }
}

// export const getConfig: Middleware = async (ctx: Context) => {
//   req.app.getConfig(function (err, config) {
//     if (err) {
//       config = myUtils.defaultConfig
//     }
//     return res.send(config);
//   });
// }
