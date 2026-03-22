import { Request, Response } from 'express';
import { authService } from '../../../composition-root';
import { LoginUserDto } from '../../types/login-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { SessionDto } from '../../../securityDevices/types/session.dto';


export async function loginUser(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
    try {
        const { loginOrEmail, password } = req.body;
        const sessionDto: SessionDto = {
            ip: req.ip || 'lol',
            title: req.headers['user-agent'] || 'default',
        };
        const {accessToken, refreshToken } = await authService.loginUser(loginOrEmail, password, sessionDto);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        return res.status(HttpResponceCodes.OK_200).send({accessToken: accessToken});
    } catch(e: unknown) {
        const err = e as { message: string };

        if (err?.message === 'Unauthorized') {
            return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }

        throw new Error('some error in loginUser');
    }
};
