import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../adapters/jwt.service';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { container } from '../../ioc/composition-root';


const jwtService: JwtService = container.resolve(JwtService)

export async function refreshTokenAutorizationMiddleware (req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    let result: {userId: string} | null;

    try {
        result = await jwtService.getUserIdByToken(refreshToken);

        if (!result) {
            return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }
    } catch(e) {
        console.error(e);
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    req.userId = result.userId;
    return next();
};
