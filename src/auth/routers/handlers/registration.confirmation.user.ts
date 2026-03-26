import { Request, Response } from 'express';
import { authService } from '../../../composition-root';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { API_ERRORS } from '../../../core/constants/apiErrors';
import { rateLimitRepository } from '../../repositories/rate.limit.repositories';


export async function registrationConfirmationUser(req: Request<{}, {}, {code: string}, {}>, res: Response) {
    try {
        const { code } = req.body;
        const responce = await authService.registrationConfirmation(code);
    
        const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
        await rateLimitRepository.deleteAllActivities(limitId);
        return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(e: unknown) {
        const err = e as { message: string };
        if (err?.message === 'user is not exist') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.NOT_FIND ]});
        }

        if (err?.message === 'expired code') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.EXPIRED ]});
        }

        if (err?.message === 'user has already been applied') {
           return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.APPLIED ]});
        }

        throw new Error('some error in create user handler');
    }
};
