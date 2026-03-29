import express, { Router } from 'express';
import {
    loginUserValidation,
    newPasswordValidation,
    confirmationCodeValidation,
    resendingEmailValidation,
} from './body.input-dto.validation-middleware';
import { createUserValidation } from '../../users/routers/body.input-dto.validation-middleware';
import { accessTokenAutorizationMiddleware } from '../middlewares/access-token-autorization-middleware';
import { refreshTokenAutorizationMiddleware } from '../middlewares/refresh-token-autorization-middleware';
import { rateLimitMiddleware } from '../middlewares/rate-limit-middleware';
import { container } from '../../ioc/composition-root';
import { AuthController } from './auth-controller';

const authController: AuthController = container.resolve(AuthController)

export const authRouter: express.Router = Router({});

authRouter.get(
    '/me',
    accessTokenAutorizationMiddleware,
    authController.getLoginedUser.bind(authController)
)

authRouter.post(
    '/login',
    loginUserValidation,
    rateLimitMiddleware,
    authController.loginUser.bind(authController)
);

authRouter.post(
    '/registration',
    createUserValidation,
    rateLimitMiddleware,
    authController.registrationUser.bind(authController)
);

authRouter.post(
    '/registration-confirmation',
    confirmationCodeValidation,
    rateLimitMiddleware,
    authController.registrationConfirmationUser.bind(authController)
);

authRouter.post(
    '/registration-email-resending',
    resendingEmailValidation,
    rateLimitMiddleware,
    authController.registrationEmailResending.bind(authController)
);

authRouter.post(
    '/refresh-token',
    refreshTokenAutorizationMiddleware,
    authController.getNewAccessAndRefreshTokensHandler.bind(authController)
);

authRouter.post(
    '/logout',
    refreshTokenAutorizationMiddleware,
    authController.logoutUserHandler.bind(authController)
);

authRouter.post(
    '/password-recovery',
    resendingEmailValidation,
    rateLimitMiddleware,
    authController.passwordRecovery.bind(authController)
);

authRouter.post(
    '/new-password',
    newPasswordValidation,
    rateLimitMiddleware,
    authController.newPasswordConfirmation.bind(authController)
);