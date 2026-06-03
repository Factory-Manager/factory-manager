import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { load } from 'js-yaml'
import swaggerUi from 'swagger-ui-express'

const __dirname = dirname(fileURLToPath(import.meta.url))
const spec = load(
  readFileSync(join(__dirname, '../../docs/openapi.yaml'), 'utf8')
)

export function configureDocs(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec))
}
