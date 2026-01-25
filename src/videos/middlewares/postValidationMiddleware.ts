import { Request, Response, NextFunction  } from 'express';
import { CreateVideo, AvailableResolutions } from '../types/video';
import { ErrorsMessages } from '../../core/types/errorsMessagesTypes';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { HttpResponceCodes } from '../../core/types/responseCodes';

const isString = (prop: string) => typeof (prop) === 'string';

export const checkPostBody = (
    req: Request<{}, {}, CreateVideo, {}>,
    res: Response,
    next: NextFunction
) => {
    const { author, title, availableResolutions } = req.body;
    const errorsMessages: ErrorsMessages =  {
        errorsMessages: [],
    };

    const error = errorsMessages.errorsMessages;

    if (!author)  error.push(API_ERRORS.author.NOT_FIND);

    if (!title)  error.push(API_ERRORS.title.NOT_FIND);

    if (author && !isString(author))  error.push(API_ERRORS.author.NOT_A_STRING);

    if (title && !isString(title))  error.push(API_ERRORS.title.NOT_A_STRING);

    if(Array.isArray(availableResolutions) === false || availableResolutions.length < 1) error.push(API_ERRORS.availableResolutions.NOT_ARRAY);

    if ( Array.isArray(availableResolutions) ) {
        for (let i = 0; i < availableResolutions.length; i++) {
            if ( !Object.values(AvailableResolutions).includes(availableResolutions[i]) ) {
                error.push(API_ERRORS.availableResolutions.NOT_FIND);
            }
        }
    }


    if (author && author.length >= 40) error.push(API_ERRORS.author.IS_TOO_LONG);
    if (title && title.length >= 20) error.push(API_ERRORS.title.IS_TOO_LONG);

    if (error.length > 0) {
        if (req.errorsMessages) {
             req.errorsMessages.errorsMessages = [ ...req.errorsMessages.errorsMessages, ...errorsMessages.errorsMessages];
        } else {
            req.errorsMessages = errorsMessages;
        }
    } 

   return next();
}