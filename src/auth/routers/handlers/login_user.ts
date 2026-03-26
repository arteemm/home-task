import { Request, Response } from 'express';
import { authService } from '../../../composition-root';
import { LoginUserDto } from '../../types/login-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { SessionDto } from '../../../securityDevices/types/session.dto';
import { rateLimitRepository } from '../../repositories/rate.limit.repositories';


export async function loginUser(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
    try {
        const { loginOrEmail, password } = req.body;
        const sessionDto: SessionDto = {
            ip: req.ip || 'lol',
            title: req.headers['user-agent'] || 'default',
            originalUrl: req.originalUrl,
        };
        const {accessToken, refreshToken } = await authService.loginUser(loginOrEmail, password, sessionDto);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        const limitId = Buffer.from(sessionDto.ip + sessionDto.originalUrl).toString('base64');
        await rateLimitRepository.deleteAllActivities(limitId);
        return res.status(HttpResponceCodes.OK_200).send({accessToken: accessToken});
    } catch(e: unknown) {
        const err = e as { message: string };

        if (err?.message === 'Unauthorized') {
            return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }

        throw new Error('some error in loginUser');
    }
};
