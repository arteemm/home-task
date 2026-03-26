import { Request, Response } from 'express';
import { authService } from '../../../composition-root';
import { CreateUserDto } from '../../../users/types/create-user-dto';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { API_ERRORS } from '../../../core/constants/apiErrors';
import { rateLimitRepository } from '../../repositories/rate.limit.repositories';


export async function registrationUser(req: Request<{}, {}, CreateUserDto, {}>, res: Response) {
    try {
        const { login, password, email } = req.body;
        const responce = await authService.createUser({ login, password, email });

        const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
        await rateLimitRepository.deleteAllActivities(limitId);
        return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(e: unknown) {
        const err = e as { message: string };
        if (err?.message === 'login is not unique') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.login.MUST_BE_UNIQUE ]});
        }

        if (err?.message === 'email is not unique') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.email.MUST_BE_UNIQUE ]});
        }

        throw new Error('some error in create user handler');
    }
};
