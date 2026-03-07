import { Request, Response } from 'express';
import { userService } from '../../domain/user-service';
import { usersQueryRepository } from '../../repositories/user.query.repository';
import { CreateUserDto } from '../../types/create-user-dto';
import { UserViewModel } from '../../types/user-view-model';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { API_ERRORS, ErrorsMessages } from '../../../core/constants/apiErrors';


export async function createUser(req: Request<{}, {}, CreateUserDto, {}>, res: Response<UserViewModel | ErrorsMessages>) {
    try {
        const { login, password, email } = req.body;

        const userID = await userService.createUser({ login, password, email });
        const user = await usersQueryRepository.findById(userID);

        return res.status(HttpResponceCodes.CREATED_201).send(user!);
    } catch(e: unknown) {
        const err = e as { message: string };
        if (err?.message === 'login is not unique') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.login.MUST_BE_UNIQUE ]});
        }

        if (err?.message === 'email is not unique') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.email.MUST_BE_UNIQUE ]});
        }

        throw new Error(err?.message);
    }
};
