import Router from 'koa-router'
import * as redisController from '../controllers/apiv1'

const redisRouter = new Router({
  prefix: '/v1',
})

redisRouter
  .get('/', redisController.getTest)
  .get('/server/info', redisController.getServersInfo)
  .get('/connection/:connectionId', redisController.isConnected)
  // .get('/key/:connectionId/:key(*)', getKeyDetails)
  // .get('/key/:connectionId/:key(*)', redisController.getKeyDetails)
  // .post('/key/:connectionId/:key(*)', redisController.postKey)
  // .post('/keys/:connectionId/:key(*)', redisController.postKeys)
  // // modify entries - newer api with post/put/del and additional POST equivalents
  // // and unified form params

  // .post('/list/value', redisController.postAddListValue)
  // .put('/list/value', redisController.postEditListValue)
  // .delete('/list/value', redisController.postDeleteListValue)
  // .post('/list/value/add', redisController.postAddListValue)
  // .post('/list/value/edit', redisController.postEditListValue)
  // .post('/list/value/delete', redisController.postDeleteListValue)

  // .post('/set/member', redisController.postAddSetMember)
  // .put('/set/member', redisController.postEditSetMember)
  // .delete('/set/member', redisController.postDeleteSetMember)
  // .post('/set/member/add', redisController.postAddSetMember)
  // .post('/set/member/edit', redisController.postEditSetMember)
  // .post('/set/member/delete', redisController.postDeleteSetMember)

  // .post('/zset/member', redisController.postAddZSetMember)
  // .put('/zset/member', redisController.postEditZSetMember)
  // .delete('/zset/member', redisController.postDeleteZSetMember)
  // .post('/zset/member/add', redisController.postAddZSetMember)
  // .post('/zset/member/edit', redisController.postEditZSetMember)
  // .post('/zset/member/delete', redisController.postDeleteZSetMember)

  // .post('/hash/field', redisController.postAddHashField)
  // .put('/hash/field', redisController.postEditHashField)
  // .delete('/hash/field', redisController.postDeleteHashField)
  // .post('/hash/field/add', redisController.postAddHashField)
  // .post('/hash/field/edit', redisController.postEditHashField)
  // .post('/hash/field/delete', redisController.postDeleteHashField)

  // // helpers and stuff same as v1 api
  // .post('/encodeString/:stringValue', redisController.encodeString)
  // .get('/keystree/:connectionId/:keyPrefix(*)', redisController.getKeysTree)
  // .get('/keystree/:connectionId', redisController.getKeysTree)
  // .get('/keys/:connectionId/:keyPrefix(*)', redisController.getKeys)
  .post('/exec/:connectionId', redisController.postExec)

export default redisRouter
