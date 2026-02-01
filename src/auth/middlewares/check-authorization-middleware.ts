import { Request, Response, NextFunction } from 'express';
import { Buffer } from 'node:buffer';
import { HttpResponceCodes } from '../../core/constants/responseCodes';


const password = 'qwerty';
const login = 'admin';

export function checkAuthorizationMiddlewares (req: Request, res: Response, next: NextFunction) {
    const authorizationHeader: string | undefined = req.headers.authorization;

    if (!authorizationHeader) {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    const loginWithPassword = authorizationHeader.split(' ')[1];

    if (Buffer.from(loginWithPassword, 'base64').toString() !== `${login}:${password}`) {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    return next();
};
