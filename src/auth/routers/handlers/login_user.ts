import { Request, Response } from 'express';
import { authService } from '../../domain/auth-service';
import { LoginUserDto } from '../../types/login-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export async function loginUser(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
    try {
        const { loginOrEmail, password } = req.body;
        const isLoginUser = await authService.checkUserCredentials(loginOrEmail, password);
        
        if (!isLoginUser) {
            return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }

        return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(e: unknown) {
        console.log(e);
        throw new Error('some error in loginUser');
    }
};
