import { Context, Middleware } from 'koa'

export const exportData: Middleware = async (ctx: Context) => {
  ctx.body = { success: true, message: 'success', result: [
    { name: 'michael' },
    { name: 'joyce' },
  ] }
}

export const importData: Middleware = async (ctx: Context) => {
  ctx.body = { success: true, message: 'success', result: [
    { name: 'michael' },
    { name: 'joyce' },
  ] }
}
