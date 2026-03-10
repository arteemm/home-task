import { Request, Response } from 'express';
import { usersQueryRepository } from '../../../users/repositories/user.query.repository';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { LoginUserViewModel } from '../../types/login-user-view-model';


export async function getLoginedUser(req: Request, res: Response<LoginUserViewModel>) {
    const userId = req.userId as string;
    const user = await usersQueryRepository.findById(userId);

    if (!user) {
        return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
    }

    return res.status(HttpResponceCodes.OK_200).send({
        email: user.email,
        login: user.login,
        userId: user.id,
    });
}
