import mongoose from 'mongoose'

import {
  USER_ROLES,
  USER_ROLE_VALUES
} from '../../../domain/users/user.roles.js'

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
        required: true
      },
      last: {
        type: String,
        trim: true,
        required: true
      }
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.OPERATOR,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

userSchema.index({ email: 1 }, { unique: true })

userSchema.virtual('fullName').get(function () {
  return `${this.name.first} ${this.name.last}`
})

export const UserModel = model('User', userSchema)
