const DEFAULT_PORT = 3000

function getRequiredEnv(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name} environment variable`)
  }

  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || DEFAULT_PORT),
  mongoUri: getRequiredEnv('MONGO_URI')
}
