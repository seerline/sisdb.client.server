import assert from 'assert'
import { describe, it } from 'mocha'
import supertest from 'supertest'
import app from '../../src/app'
import { redisOptions, buildConnectionId } from '../fixtures/redisOptions'
const request = supertest.agent(app.listen())

describe('./test/controller/api.test.ts', () => {
  afterEach(async () => {
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
  describe.only('should GET /server/info', () => {
    it('should OK', async () => {
      await request.post('/login')
        .send(redisOptions[0])
        .expect(200)
        .expect({ ok: true })

      const { body } = await request.get(`/api/v1/server/info`)
        .expect(200)
      assert(body)
    })
  })
})
