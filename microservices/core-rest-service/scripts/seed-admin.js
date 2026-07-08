import 'dotenv/config'

import readline from 'node:readline'

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

function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 'y')
    })
  })
}

const mongoUri = requireVar('MONGO_URI')
const adminEmail = requireVar('ADMIN_EMAIL').trim().toLowerCase()
const adminPassword = requireVar('ADMIN_PASSWORD')
const adminFirstName = requireVar('ADMIN_FIRST_NAME').trim()
const adminLastName = requireVar('ADMIN_LAST_NAME').trim()
const adminPhonePrefix = requireVar('ADMIN_PHONE_PREFIX').trim()
const adminPhoneNumber = requireVar('ADMIN_PHONE_NUMBER').trim()

async function seedAdmin() {
  if (!PASSWORD_REGEX.test(adminPassword)) {
    console.error(
      'ADMIN_PASSWORD must be at least 8 characters and contain one letter, one number, and one special character'
    )
    process.exit(1)
  }

  await mongoose.connect(mongoUri)

  try {
    const existingAdmin = await UserModel.findOne({
      role: USER_ROLES.ADMIN
    }).exec()

    if (existingAdmin) {
      const confirmed = await confirm(
        `Admin user already exists (${existingAdmin.email}).\nUpdate with current environment variables? [y/N] `
      )

      if (!confirmed) {
        console.log('Skipping.')
        return
      }

      const passwordHasher = createPasswordHasher()
      const passwordHash = await passwordHasher.hashPassword(adminPassword)

      try {
        await UserModel.findByIdAndUpdate(
          existingAdmin._id,
          {
            name: { first: adminFirstName, last: adminLastName },
            email: adminEmail,
            passwordHash,
            phoneNumber: { prefix: adminPhonePrefix, number: adminPhoneNumber }
          },
          { runValidators: true }
        ).exec()
      } catch (err) {
        if (err.code === 11000) {
          throw new Error(
            `Cannot update admin email to ${adminEmail}: that address is already in use by another user`,
            { cause: err }
          )
        }
        throw err
      }

      console.log(`Admin user updated: ${adminEmail}`)
      return
    }

    const existingUser = await UserModel.findOne({ email: adminEmail }).exec()

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
      isActive: true,
      phoneNumber: { prefix: adminPhonePrefix, number: adminPhoneNumber }
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
