import { createUserService } from '#src/application/users/user.service.js'
import { createUserRepository } from '#src/persistence/mongoose/repositories/user.repository.js'
import { createPasswordHasher } from '#src/security/password-hasher.js'

export function createUsersBootstrap() {
  const passwordHasher = createPasswordHasher()
  const userRepository = createUserRepository()
  const userService = createUserService({ userRepository, passwordHasher })

  return { userService }
}
