import assert = require('assert')
import { after, describe, it } from 'mocha'
import supertest from 'supertest'
import app from '../src/app'

const request = supertest.agent(app.listen())

describe('Init test', () => {
  it('should /tools/export', async () => {
    const { body } = await request.get('/tools/export')
      .set('Accept', 'application/json')
      .expect(200)
    assert(body)
  })
})
