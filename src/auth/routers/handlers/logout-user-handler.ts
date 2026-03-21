import { Request, Response } from 'express';
import { authService } from '../../../composition-root';
import { LoginUserDto } from '../../types/login-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export async function logoutUserHandler(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.userId as string;

    try {
        await authService.logoutUser(userId, refreshToken);
        return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(e) {
        throw new Error('some error in logout user');
    }
}