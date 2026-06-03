import SwaggerParser from '@apidevtools/swagger-parser'

const REQUIRED_OPERATIONS = [
  ['post', '/api/users'],
  ['get', '/api/users'],
  ['get', '/api/users/{id}'],
  ['patch', '/api/users/{id}'],
  ['delete', '/api/users/{id}']
]

let api
try {
  api = await SwaggerParser.validate('docs/openapi.yaml')
  console.log('OpenAPI spec is valid')
} catch (error) {
  console.error('OpenAPI spec validation failed:', error.message)
  process.exit(1)
}

const missing = REQUIRED_OPERATIONS.filter(
  ([method, path]) => !api.paths[path]?.[method]
)

if (missing.length > 0) {
  console.error('OpenAPI spec is missing required operations:')
  for (const [method, path] of missing) {
    console.error(`  ${method.toUpperCase()} ${path}`)
  }
  process.exit(1)
}

console.log(`OpenAPI spec covers all ${REQUIRED_OPERATIONS.length} required operations`)
