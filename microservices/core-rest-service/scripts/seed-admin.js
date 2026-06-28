import 'dotenv/config'

import mongoose from 'mongoose'

import { PASSWORD_REGEX } from '#src/domain/users/password-policy.js'
import { USER_ROLES } from '#src/domain/users/user.roles.js'
import { UserModel } from '#src/persistence/mongoose/models/user.model.js'
import { createPasswordHasher } from '#src/security/password-hasher.js'

function requireVar(name) {
  const value = process.env[name]

  if (!value || value.trim() === '') {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }

  return value
}

const mongoUri = requireVar('MONGO_URI')
const adminEmail = requireVar('ADMIN_EMAIL').trim().toLowerCase()
const adminPassword = requireVar('ADMIN_PASSWORD')
const adminFirstName = requireVar('ADMIN_FIRST_NAME').trim()
const adminLastName = requireVar('ADMIN_LAST_NAME').trim()

async function seedAdmin() {
  await mongoose.connect(mongoUri)

  try {
    if (!PASSWORD_REGEX.test(adminPassword)) {
      throw new Error(
        'ADMIN_PASSWORD must be at least 8 characters and contain one letter, one number, and one special character'
      )
    }

    const existingAdmin = await UserModel.findOne({
      role: USER_ROLES.ADMIN
    }).exec()

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping.')
      return
    }

    const existingUser = await UserModel.findOne({
      email: adminEmail
    }).exec()

    if (existingUser) {
      throw new Error(
        `User with email ${adminEmail} already exists but is not an admin`
      )
    }

    const passwordHasher = createPasswordHasher()
    const passwordHash = await passwordHasher.hashPassword(adminPassword)

    await UserModel.create({
      name: { first: adminFirstName, last: adminLastName },
      email: adminEmail,
      passwordHash,
      role: USER_ROLES.ADMIN,
      isActive: true
    })

    console.log(`Admin user created: ${adminEmail}`)
  } finally {
    await mongoose.disconnect()
  }
}

seedAdmin().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})
