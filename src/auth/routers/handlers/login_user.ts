import { Request, Response } from 'express';
import { authService } from '../../domain/auth-service';
import { LoginUserDto } from '../../types/login-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export async function loginUser(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
    try {
        const { loginOrEmail, password } = req.body;
        const accessToken = await authService.loginUser(loginOrEmail, password);

        return res.status(HttpResponceCodes.OK_200).send({accessToken: accessToken});
    } catch(e: unknown) {
        const err = e as { message: string };

        if (err?.message === 'Unauthorized') {
            return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }

        throw new Error('some error in loginUser');
    }
};
