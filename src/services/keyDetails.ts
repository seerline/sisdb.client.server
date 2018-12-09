import { Context } from 'koa'
import * as myutil from '../utils'

export async function sendWithTTL(ctx: Context, details: object, key: string) {
  const ttl = await ctx.redisClient.ttl(key)
  return myutil.encodeHTMLEntities(JSON.stringify({ ttl, ...details }))
}

export async function getKeyDetailsString (ctx: Context, key: string) {
  try {
    const val = await ctx.redisClient.get(key)
    const details = {
      key,
      type: 'string',
      value: val,
    }
    return sendWithTTL(ctx, details, key)
  } catch (error) {
    console.error('getKeyDetailsString', error)
  }
}

export async function getKeyDetailsList (ctx: Context, key: string) {
  let startIdx = parseInt(ctx.query.index, 10)
  if (typeof(startIdx) === 'undefined' || isNaN(startIdx) || startIdx < 0) {
    startIdx = 0
  }
  const endIdx = startIdx + 19
  try {
    let items = await ctx.redisClient.lrange(key, startIdx, endIdx)
    let i = startIdx
    items = items.map((item: any) => {
      return {
        number: i++,
        value: item,
      }
    })
    const len = await ctx.redisClient.llen(key)
    const details = {
      key,
      type: 'list',
      items,
      beginning: startIdx <= 0,
      end: endIdx >= len - 1,
      len,
    }
    return sendWithTTL(ctx, details, key)
  } catch (error) {
    console.error('getKeyDetailsList', error)
  }
}

export async function getKeyDetailsHash (ctx: Context, key: string) {
  try {
    const fieldsAndValues = await ctx.redisClient.hgetall(key)
    const details = {
      key,
      type: 'hash',
      data: fieldsAndValues,
    }
    return sendWithTTL(ctx, details, key)
  } catch (error) {
    console.error('getKeyDetailsHash', error)
    return null
  }
}

export async function getKeyDetailsSet (ctx: Context, key: string) {
  try {
    const members = await ctx.redisClient.smembers(key)
    const details = {
      key,
      type: 'set',
      members,
    }
    return sendWithTTL(ctx, details, key)
  } catch (error) {
    console.error('getKeyDetailsSet', error)
    return null
  }
}

export function mapZSetItems (items: any[]) {
  const results = []
  for (let i = 0; i < items.length; i += 2) {
    results.push({
      score: items[i + 1],
      value: items[i],
    })
  }
  return results
}

export async function getKeyDetailsZSet(ctx: Context, key: string) {
  try {
      let startIdx = parseInt(ctx.query.index, 10)
      if (typeof(startIdx) === 'undefined' || isNaN(startIdx) || startIdx < 0) {
        startIdx = 0
      }
      const endIdx = startIdx + 19
      let items = await ctx.redisClient.zrevrange(key, startIdx, endIdx, 'WITHSCORES')
      items = mapZSetItems(items)

      let i = startIdx
      items.forEach(function (item: any) {
        item.number = i++
      })
      const len = await ctx.redisClient.zcount(key, '-inf', '+inf')
      const details = {
        key,
        type: 'zset',
        items,
        beginning: startIdx <= 0,
        end: endIdx >= len - 1,
        length: len,
      }
      return sendWithTTL(ctx, details, key)
  } catch (error) {
    console.error('getKeyDetailsZSet', error)
    return null
  }
}
