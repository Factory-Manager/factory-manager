import mongoose from 'mongoose'
import { logger } from './logger.js'

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected')
})

mongoose.connection.on('error', (error) => {
  logger.error({ err: error }, 'MongoDB connection error')
})

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected')
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
