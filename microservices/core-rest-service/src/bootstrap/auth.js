import { createAuthService } from '#src/application/auth/auth.service.js'
import { env } from '#src/config/env.js'
import { createAuthenticateRequest } from '#src/middlewares/authenticate-request.js'
import { createUserRepository } from '#src/persistence/mongoose/repositories/user.repository.js'
import { createAuthRouter } from '#src/routes/auth.router.js'
import { createJwtService } from '#src/security/jwt.js'
import { createPasswordHasher } from '#src/security/password-hasher.js'

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
