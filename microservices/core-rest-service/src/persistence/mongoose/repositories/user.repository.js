import { UserModel as MongooseUserModel } from '../models/user.model.js'

const USER_UPDATE_OPTIONS = Object.freeze({
  new: true,
  runValidators: true,
  context: 'query'
})

/**
 * @typedef {ExecutableQuery & {
 *   select: (fields: string) => ExecutableQuery
 * }} SelectableQuery
 */

/**
 * @typedef {Object} UserModelPort
 * @property {(userData: object) => Promise<unknown>} create
 * @property {(query: object) => ExecutableQuery} findOne
 * @property {(id: string) => ExecutableQuery} findById
 * @property {(id: string, updateData: object, options: object) => ExecutableQuery} findByIdAndUpdate
 * @property {(id: string) => ExecutableQuery} findByIdAndDelete
 * @property {() => FindUsersQuery} find
 */

const defaultUserModel = MongooseUserModel

export function createUserRepository({ userModel = defaultUserModel } = {}) {
  async function createUser(userData) {
    return userModel.create(userData)
  }

  async function findUserByEmailForAuth(email) {
    return userModel.findOne({ email }).select('+passwordHash').exec()
  }

  async function updateLastLoginAt(userId, date) {
    return userModel
      .findByIdAndUpdate(userId, { lastLoginAt: date }, USER_UPDATE_OPTIONS)
      .exec()
  }

  async function findUserById(id) {
    return userModel.findById(id).exec()
  }

  async function updateUserById(id, updateData) {
    return userModel
      .findByIdAndUpdate(id, updateData, USER_UPDATE_OPTIONS)
      .exec()
  }

  async function deleteUserById(id) {
    return userModel.findByIdAndDelete(id).exec()
  }

  async function findUsers({ limit, offset }) {
    return userModel.find().sort({ _id: 1 }).skip(offset).limit(limit).exec()
  }

  return Object.freeze({
    createUser,
    findUserByEmailForAuth,
    findUserById,
    updateUserById,
    updateLastLoginAt,
    deleteUserById,
    findUsers
  })
}
