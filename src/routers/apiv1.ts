import Router from 'koa-router'
import * as redisController from '../controllers/redis'

const redisRouter = new Router({
  prefix: '/v1',
})

redisRouter
  .get('/', redisController.getTest)
  .get('/server/info', redisController.getServersInfo)
  .get('/connection/:connectionId', redisController.isConnected)
  // .get('/key/:connectionId/:key(*)', getKeyDetails)

// routerV2.get('/key/:connectionId/:key(*)', getKeyDetails);
// routerV2.post('/key/:connectionId/:key(*)', postKey);
// routerV2.post('/keys/:connectionId/:key(*)', postKeys);
// // modify entries - newer api with post/put/del and additional POST equivalents
// // and unified form params

// routerV2.post('/list/value', postAddListValue);
// routerV2.put('/list/value', postEditListValue);
// routerV2.delete('/list/value', postDeleteListValue);
// routerV2.post('/list/value/add', postAddListValue);
// routerV2.post('/list/value/edit', postEditListValue);
// routerV2.post('/list/value/delete', postDeleteListValue);

// routerV2.post('/set/member', postAddSetMember);
// routerV2.put('/set/member', postEditSetMember);
// routerV2.delete('/set/member', postDeleteSetMember);
// routerV2.post('/set/member/add', postAddSetMember);
// routerV2.post('/set/member/edit', postEditSetMember);
// routerV2.post('/set/member/delete', postDeleteSetMember);

// routerV2.post('/zset/member', postAddZSetMember);
// routerV2.put('/zset/member', postEditZSetMember);
// routerV2.delete('/zset/member', postDeleteZSetMember);
// routerV2.post('/zset/member/add', postAddZSetMember);
// routerV2.post('/zset/member/edit', postEditZSetMember);
// routerV2.post('/zset/member/delete', postDeleteZSetMember);

// routerV2.post('/hash/field', postAddHashField);
// routerV2.put('/hash/field', postEditHashField);
// routerV2.delete('/hash/field', postDeleteHashField);
// routerV2.post('/hash/field/add', postAddHashField);
// routerV2.post('/hash/field/edit', postEditHashField);
// routerV2.post('/hash/field/delete', postDeleteHashField);

// // helpers and stuff same as v1 api
// routerV2.post('/encodeString/:stringValue', encodeString);
// routerV2.get('/keystree/:connectionId/:keyPrefix(*)', getKeysTree);
// routerV2.get('/keystree/:connectionId', getKeysTree);
// routerV2.get('/keys/:connectionId/:keyPrefix(*)', getKeys);
// routerV2.post('/exec/:connectionId', postExec);

// routerV2.param('connectionId', getConnection);

export default redisRouter
