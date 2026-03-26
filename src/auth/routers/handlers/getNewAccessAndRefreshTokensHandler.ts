import { Request, Response } from 'express';
import { authService } from '../../../composition-root';
import { LoginUserDto } from '../../types/login-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { SessionDto } from '../../../securityDevices/types/session.dto';


export async function getNewAccessAndRefreshTokensHandler(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
    const expiredRefreshToken = req.cookies.refreshToken;
    const userId = req.userId as string;

    try {
        const sessionDto: SessionDto = {
            ip: req.ip || 'lol',
            title: req.headers['user-agent'] || 'default',
            originalUrl: req.originalUrl,
        };
        const {accessToken, newRefreshToken} = await authService.getNewAccessAndRefreshTokens(userId, expiredRefreshToken, sessionDto);
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

        res.status(HttpResponceCodes.OK_200).send({accessToken: accessToken});
    } catch(e: unknown) {
        const err = e as { message: string };
        if (err?.message === 'Unauthorized') {
            res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }

        throw new Error('some error in refresh token');
    }
};