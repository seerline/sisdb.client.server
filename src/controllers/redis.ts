import { Context, Middleware } from 'koa'

export const getTest: Middleware = async (ctx: Context) => {
  ctx.body = 'hello'
}

export const getServersInfo: Middleware = async (ctx: Context) => {
  const data = await ctx.redisClient.info()
  ctx.body = data
  //   let connectionInfo = {
  //       label: redisConnection.label,
  //       host: redisConnection.options.host,
  //       port: redisConnection.options.port,
  //       db: redisConnection.options.db,
  //   };
  //   if (err) {
  //     console.error('getServerInfo', err);
  //     connectionInfo.error = err.message;
  //     return callback(err, connectionInfo);
  //   }
  //   let infoLines = serverInfo
  //     .split('\n')
  //     .map(function (line) {
  //       line = line.trim();
  //       let parts = line.split(':');
  //       return {
  //         key: inflection.humanize(parts[0]),
  //         value: parts.slice(1).join(':')
  //       };
  //     });
  //   connectionInfo.info = infoLines;
  //   return callback(null, connectionInfo);
  // });
}