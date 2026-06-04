import { createUserService } from '../application/users/user.service.js'
import { createUserRepository } from '../persistence/mongoose/repositories/user.repository.js'
import { createPasswordHasher } from '../security/password-hasher.js'

export function createUsersBootstrap() {
  const passwordHasher = createPasswordHasher()
  const userRepository = createUserRepository()
  const userService = createUserService({ userRepository, passwordHasher })

  return { userService }
}
