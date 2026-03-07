import express, { Router } from 'express';
import { loginUser } from './handlers/login_user';
import { loginUserValidation } from './body.input-dto.validation-middleware';


export const authRouter: express.Router = Router({});

authRouter.post(
    '/login',
    loginUserValidation,
    loginUser
);
