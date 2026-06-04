import { createAuthService } from '../application/auth/auth.service.js'
import { env } from '../config/env.js'
import { createAuthenticateRequest } from '../middlewares/authenticate-request.js'
import { createUserRepository } from '../persistence/mongoose/repositories/user.repository.js'
import { createAuthRouter } from '../routes/auth.router.js'
import { createJwtService } from '../security/jwt.js'
import { createPasswordHasher } from '../security/password-hasher.js'

export function createAuthBootstrap() {
  const jwtService = createJwtService({
    secret: env.jwtSecret,
    expiresIn: env.jwtExpiresIn
  })
  const passwordHasher = createPasswordHasher()
  const userRepository = createUserRepository()
  const authService = createAuthService({
    userRepository,
    passwordHasher,
    jwtService
  })
  const authRouter = createAuthRouter({ authService })
  const authenticateRequest = createAuthenticateRequest({ jwtService })

  return { authRouter, authenticateRequest }
}
