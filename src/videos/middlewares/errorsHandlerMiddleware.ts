import { Request, Response, NextFunction  } from 'express';
import { ChangeVideo } from '../types/video';
import { ErrorsMessages } from '../../core/types/errorsMessagesTypes';
import { HttpResponceCodes } from '../../core/types/responseCodes';

export const errorsHandler = (
    req: Request<{}, {}, ChangeVideo, {}>,
    res: Response,
    next: NextFunction,
) => {
    if (req.errorsMessages?.errorsMessages) {
        const errorsMessages: ErrorsMessages =  req.errorsMessages;

        if (req.errorsMessages?.errorsMessages.length) {
            return res.status(HttpResponceCodes.BAD_REQUEST_400).send(errorsMessages);
        } 
    };

   return next();
};
