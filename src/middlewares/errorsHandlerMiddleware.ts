import { Request, Response, NextFunction  } from 'express';
import { ErrorMessage } from '../core/types/errorsMessagesTypes';
import { HttpResponceCodes } from '../core/constants/responseCodes';
import { validationResult } from 'express-validator';


export const errorsHandler = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next()
    }

    const validationErrors: ErrorMessage[] = [];
    result.array({ onlyFirstError: true }).forEach((error) => {
        if (error.type === 'field') {
            validationErrors.push({ message : error.msg, field: error.path});
        }
    });

    return res.status(HttpResponceCodes.BAD_REQUEST_400).send({ errorsMessages: validationErrors });
};
