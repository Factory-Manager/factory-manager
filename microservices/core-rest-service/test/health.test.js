import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import { app } from '../src/app.js'
import { closeTestServer, startTestServer } from './utils/server.js'

let server
let baseUrl

before(() => {
  const testServer = startTestServer(app)

  server = testServer.server
  baseUrl = testServer.baseUrl
})

after(async () => {
  await closeTestServer(server)
})

describe('health endpoints', () => {
  it('GET /api/health returns service status', async () => {
    const response = await fetch(`${baseUrl}/api/health`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.service, 'core-rest-service')
    assert.equal(body.status, 'ok')
    assert.equal(typeof body.timestamp, 'string')
  })

  it('GET / returns running status', async () => {
    const response = await fetch(`${baseUrl}/`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.service, 'core-rest-service')
    assert.equal(body.status, 'running')
  })

  it('returns 404 for unknown routes', async () => {
    const response = await fetch(`${baseUrl}/unknown-route`)
    const body = await response.json()

    assert.equal(response.status, 404)
    assert.equal(body.error, 'Not Found')
  })
})
