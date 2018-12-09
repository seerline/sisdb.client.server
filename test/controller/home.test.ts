import assert = require('assert')
import { describe, it } from 'mocha'
import supertest from 'supertest'
import app from '../../src/app'
import { buildConnectionId, redisOptions } from '../fixtures/redisOptions'
const request = supertest.agent(app.listen())

describe('should Post /login', () => {
  afterEach(async () => {
    // close connections
    for (const option of redisOptions) {
      const { body } = await request.get(`/api/v1/connection/${buildConnectionId(option)}`)
      if (body === true) {
        await request.post(`/logout/${buildConnectionId(option)}`)
          .expect(200)
          .expect({ ok: true })
      }
    }
  })
  it('should login success', async () => {
    await request.post('/login')
      .send(redisOptions[0])
      .expect(200)
      .expect({ ok: true })

    const { body } = await request.post('/login')
    .send(redisOptions[0])
      .expect(200)
    assert.deepEqual(body, {
      ok: true,
      message: 'Logged',
    })

    await request.post('/login')
      .send(redisOptions[1])
      .expect(200)
      .expect({ ok: true })
  })
  it('should login success', async () => {
    await request.post('/login')
      .send(redisOptions[0])
      .expect(200)
      .expect({ ok: true })
  })
})
