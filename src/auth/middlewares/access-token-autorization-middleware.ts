import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../composition-root';
import { HttpResponceCodes } from '../../core/constants/responseCodes';


export async function accessTokenAutorizationMiddleware (req: Request, res: Response, next: NextFunction) {
    const authorizationHeader: string | undefined = req.headers.authorization;

    if (!authorizationHeader) {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    if (authorizationHeader.split(' ')[0] !== 'Bearer') {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    const accessToken = authorizationHeader.split(' ')[1];

    const result = await jwtService.getUserIdByToken(accessToken);

    if (!result) {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    req.userId = result.userId;
    return next();
};
