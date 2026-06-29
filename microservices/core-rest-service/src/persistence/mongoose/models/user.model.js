import mongoose from 'mongoose'

import {
  PHONE_NUMBER_REGEX,
  PHONE_PREFIX_REGEX
} from '#src/domain/users/phone-number.js'
import {
  COLOR_FILTER_VALUES,
  THEME_VALUES
} from '#src/domain/users/user-preferences.js'
import { USER_ROLES, USER_ROLE_VALUES } from '#src/domain/users/user.roles.js'

const { Schema, model } = mongoose

const phoneNumberSchema = new Schema(
  {
    prefix: {
      type: String,
      trim: true,
      required: true,
      match: PHONE_PREFIX_REGEX
    },
    number: {
      type: String,
      trim: true,
      required: true,
      match: PHONE_NUMBER_REGEX
    }
  },
  { _id: false }
)

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
    },

    phoneNumber: { type: phoneNumberSchema, required: true },

    preferences: {
      theme: {
        type: String,
        enum: THEME_VALUES,
        default: 'light'
      }
    },

    accessibility: {
      colorFilter: {
        type: String,
        enum: COLOR_FILTER_VALUES,
        default: 'normal'
      }
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
