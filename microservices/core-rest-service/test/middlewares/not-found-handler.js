import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { ERROR_CODES } from '../../src/errors/error-codes.js'
import { notFoundHandler } from '../../src/middlewares/not-found-handler.js'

function createRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    }
  }
}

describe('notFoundHandler', () => {
  it('responds with not found for unmatched routes', () => {
    const req = {
      method: 'GET',
      originalUrl: '/api/missing'
    }
    const res = createRes()

    notFoundHandler(req, res)

    assert.equal(res.statusCode, 404)
    assert.equal(res.body.code, ERROR_CODES.NOT_FOUND)
    assert.match(res.body.message, /GET \/api\/missing/)
  })
})
