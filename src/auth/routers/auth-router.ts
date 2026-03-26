import express, { Router } from 'express';
import { loginUser } from './handlers/login_user';
import { getLoginedUser } from './handlers/get-logined-user';
import { registrationUser } from './handlers/registration-user';
import { registrationConfirmationUser } from './handlers/registration.confirmation.user';
import { registrationEmailResending } from './handlers/registration.email.resending';
import { getNewAccessAndRefreshTokensHandler } from './handlers/getNewAccessAndRefreshTokensHandler';
import { logoutUserHandler } from './handlers/logout-user-handler';
import { loginUserValidation } from './body.input-dto.validation-middleware';
import { confirmationCodeValidation } from './body.input-dto.validation-middleware';
import { resendingEmailValidation } from './body.input-dto.validation-middleware';
import { createUserValidation } from '../../users/routers/body.input-dto.validation-middleware';
import { accessTokenAutorizationMiddleware } from '../middlewares/access-token-autorization-middleware';
import { refreshTokenAutorizationMiddleware } from '../middlewares/refresh-token-autorization-middleware';
import { rateLimitMiddleware } from '../middlewares/rate-limit-middleware';


export const authRouter: express.Router = Router({});


authRouter.get(
    '/me',
    accessTokenAutorizationMiddleware,
    getLoginedUser
)

authRouter.post(
    '/login',
    loginUserValidation,
    rateLimitMiddleware,
    loginUser
);

authRouter.post(
    '/registration',
    createUserValidation,
    rateLimitMiddleware,
    registrationUser
);

authRouter.post(
    '/registration-confirmation',
    confirmationCodeValidation,
    rateLimitMiddleware,
    registrationConfirmationUser
);

authRouter.post(
    '/registration-email-resending',
    resendingEmailValidation,
    rateLimitMiddleware,
    registrationEmailResending
);

authRouter.post(
    '/refresh-token',
    refreshTokenAutorizationMiddleware,
    getNewAccessAndRefreshTokensHandler
);

authRouter.post(
    '/logout',
    refreshTokenAutorizationMiddleware,
    logoutUserHandler
);