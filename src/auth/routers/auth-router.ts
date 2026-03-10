import express, { Router } from 'express';
import { loginUser } from './handlers/login_user';
import { getLoginedUser } from './handlers/get-logined-user';
import { loginUserValidation } from './body.input-dto.validation-middleware';
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
