import mongoose from 'mongoose'

mongoose.connection.on('connected', () => {
  console.log('[core-rest-service] MongoDB connected')
})

mongoose.connection.on('error', (error) => {
  console.error('[core-rest-service] MongoDB connection error')
  console.error(error)
})

mongoose.connection.on('disconnected', () => {
  console.warn('[core-rest-service] MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('[core-rest-service] MongoDB reconnected')
})

export async function connectToDatabase(mongoUri) {
  mongoose.set('strictQuery', false)

  await mongoose.connect(mongoUri)
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect()
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1
}
