import { UserModel as MongooseUserModel } from '../models/user.model.js'

const USER_UPDATE_OPTIONS = Object.freeze({
  new: true,
  runValidators: true,
  context: 'query'
})

/**
 * @typedef {Object} ExecutableQuery
 * @property {() => Promise<unknown>} exec
 */

/**
 * @typedef {Object} FindUsersQuery
 * @property {(offset: number) => { limit: (limit: number) => ExecutableQuery }} skip
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

/** @type {UserModelPort} */
const defaultUserModel = MongooseUserModel

export function createUserRepository({ userModel = defaultUserModel } = {}) {
  async function createUser(userData) {
    return userModel.create(userData)
  }

  async function findUserByEmail(email) {
    return userModel.findOne({ email }).exec()
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
    return userModel.find().skip(offset).limit(limit).exec()
  }

  return Object.freeze({
    createUser,
    findUserByEmail,
    findUserById,
    updateUserById,
    deleteUserById,
    findUsers
  })
}

export const userRepository = createUserRepository()
