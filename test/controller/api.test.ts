import assert from 'assert'
import { describe, it } from 'mocha'
import supertest from 'supertest'
import app from '../../src/app'
import { buildConnectionId, redisOptions } from '../fixtures/redisOptions'
const request = supertest.agent(app.listen())

describe('./test/controller/api.test.ts', () => {
  before(async () => {
    await request.post('/login')
      .send(redisOptions[0])
      .expect(200)
      .expect({ ok: true })
  })
  after(async () => {
    // close connections
    for (const option of redisOptions) {
      const { body } = await request.get(`/api/v1/connection/${buildConnectionId(option)}`)
        .expect(200)
      if (body === true) {
        await request.post(`/logout/${buildConnectionId(option)}`)
          .expect(200)
          .expect({ ok: true })
      }
    }
  })
  describe('should GET /server/info', () => {
    it('should OK', async () => {
      const { body } = await request.get(`/api/v1/server/info`)
        .expect(200)
      assert(body)
    })
  })
  describe('should POST /server/info', () => {
    it('should OK', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'SET "hello" "world"',
        })
        .expect(200)
      const { body } = await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'GET "hello"',
        })
        .expect(200)
      assert(body.result)
    })
    it('should Invalid Command', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'GETT "hello"',
        })
        .expect(400)
        .expect({ statusCode: 400,
          error: 'Bad Request',
          message: 'ERROR: Invalid Command',
        })
    })
  })
  describe('should GET /key/:connectionId/:key', () => {
    it('should OK#string', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'SET "hello" "world"',
        })
        .expect(200)
      const { body } = await request.get(`/api/v1/key/${buildConnectionId(redisOptions[0])}/hello`)
        .expect(200)
      assert.equal(body.type, 'string')
      assert.equal(body.value, 'world')
    })
    it('should OK#list', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'DEL "MYLIST"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'LPUSH "MYLIST" "list1"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'LPUSH "MYLIST" "list2"',
        })
        .expect(200)
      const { body } = await request.get(`/api/v1/key/${buildConnectionId(redisOptions[0])}/MYLIST`)
        .expect(200)
      assert.equal(body.type, 'list')
      assert.equal(body.items.length, 2)
    })
    it('should OK#set', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'DEL "MYSET"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'SADD "MYSET" "list1"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'SADD "MYSET" "list2"',
        })
        .expect(200)
      const { body } = await request.get(`/api/v1/key/${buildConnectionId(redisOptions[0])}/MYSET`)
        .expect(200)
      assert.equal(body.type, 'set')
      assert.equal(body.members.length, 2)
    })
    it('should OK#zset', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'DEL "MYZSET"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'ZADD "MYZSET" 1 "list1"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'ZADD "MYZSET" 2 "list2"',
        })
        .expect(200)
      const { body } = await request.get(`/api/v1/key/${buildConnectionId(redisOptions[0])}/MYZSET`)
        .expect(200)
      assert.equal(body.type, 'zset')
      assert.equal(body.items.length, 2)
    })
    it('should OK#hash', async () => {
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'DEL "MYHASH"',
        })
        .expect(200)
      await request.post(`/api/v1/exec/${buildConnectionId(redisOptions[0])}`)
        .send({
          cmd: 'HMSET MYHASH name "sisdb" description "a time series db" likes 20 visitors 23000',
        })
        .expect(200)
      const { body } = await request.get(`/api/v1/key/${buildConnectionId(redisOptions[0])}/MYHASH`)
        .expect(200)
      assert.equal(body.type, 'hash')
      assert.equal(body.data.name, 'sisdb')
    })
  })
})
