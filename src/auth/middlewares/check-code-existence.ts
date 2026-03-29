import { Request, Response, NextFunction } from 'express';
import { usersQueryRepository } from '../../users/repositories/user.query.repository';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { API_ERRORS } from '../../core/constants/apiErrors';


export async function checkCodeExistence(req: Request, res: Response, next: NextFunction) {
    let code = req.body['code'];
    if (req.originalUrl === '/auth/new-password') {
        code = req.body['recoveryCode']
    }
    const user = await usersQueryRepository.findByRecoveryCode(code);
    if (!user) {
         return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.recoveryCode.NOT_FIND ]});
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
       return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.recoveryCode.EXPIRED ]});
    }

    if (user.emailConfirmation.isConfirmed) {
        return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.recoveryCode.APPLIED ]});
    }

    next();
    return;
}