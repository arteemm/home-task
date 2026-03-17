import express, { Router } from 'express';
import { loginUser } from './handlers/login_user';
import { getLoginedUser } from './handlers/get-logined-user';
import { registrationUser } from './handlers/registration-user';
import { registrationConfirmationUser } from './handlers/registration.confirmation.user';
import { registrationEmailResending } from './handlers/registration.email.resending';
import { loginUserValidation } from './body.input-dto.validation-middleware';
import { confirmationCodeValidation } from './body.input-dto.validation-middleware';
import { resendingEmailValidation } from './body.input-dto.validation-middleware';
import { createUserValidation } from '../../users/routers/body.input-dto.validation-middleware';
import { accessTokenAutorizationMiddleware } from '../middlewares/access-token-autorization-middleware';


export const authRouter: express.Router = Router({});


authRouter.get(
    '/me',
    accessTokenAutorizationMiddleware,
    getLoginedUser
)

authRouter.post(
    '/login',
    loginUserValidation,
    loginUser
);

authRouter.post(
    '/registration',
    createUserValidation,
    registrationUser
);

authRouter.post(
    '/registration-confirmation',
    confirmationCodeValidation,
    registrationConfirmationUser
);

authRouter.post(
    '/registration-email-resending',
    resendingEmailValidation,
    registrationEmailResending
);