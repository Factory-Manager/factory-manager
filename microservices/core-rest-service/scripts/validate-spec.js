import SwaggerParser from '@apidevtools/swagger-parser'

try {
  await SwaggerParser.validate('docs/openapi.yaml')
  console.log('OpenAPI spec is valid')
} catch (error) {
  console.error('OpenAPI spec validation failed:', error.message)
  process.exit(1)
}
