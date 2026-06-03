const DEFAULT_PORT = 3000

function getBooleanEnv(name, defaultValue = false) {
  const value = process.env[name]

  if (value === undefined) {
    return defaultValue
  }

  return value === 'true'
}

function getRequiredEnv(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name} environment variable`)
  }

  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === 'test' ? 'silent' : 'info'),
  docsEnabled: getBooleanEnv(
    'DOCS_ENABLED',
    process.env.NODE_ENV !== 'production'
  ),
  port: Number(process.env.PORT || DEFAULT_PORT),
  get mongoUri() {
    return getRequiredEnv('MONGO_URI')
  }
}
