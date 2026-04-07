import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../auth/adapters/jwt.service';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { container } from '../../../ioc/composition-root';


const jwtService: JwtService = container.resolve(JwtService)

export async function accessTokenAutorizationOptionalMiddleware (req: Request, res: Response, next: NextFunction) {
    const authorizationHeader: string | undefined = req.headers.authorization;

    if (!authorizationHeader) {
        return next();
    }

    if (authorizationHeader?.split(' ')[0] !== 'Bearer') {
        return next();
    }

    const accessToken = authorizationHeader.split(' ')[1];
    let result: {userId: string} | null;

    try {
        result = await jwtService.getUserIdByToken(accessToken);

        if (!result) {
           return next();
        }
    } catch(e) {
        return next();
    }


    req.userId = result.userId;
    return next();
};
