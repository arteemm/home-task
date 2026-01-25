import { Request, Response, NextFunction  } from 'express';
import { ChangeVideo } from '../types/video';
import { ErrorsMessages } from '../../core/types/errorsMessagesTypes';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { HttpResponceCodes } from '../../core/types/responseCodes';

const isBoolean = (prop: boolean) => typeof (prop) === 'boolean';
const isString = (prop: string) => typeof (prop) === 'string';
const isNumber = (prop: number) => typeof (prop) === 'number';

export const checkPutBody = (
    req: Request<{}, {}, ChangeVideo, {}>,
    res: Response,
    next: NextFunction,
) => {
    const { canBeDownloaded, publicationDate, minAgeRestriction } = req.body;
        const errorsMessages: ErrorsMessages =  {
        errorsMessages: [],
    };

    const error = errorsMessages.errorsMessages;

    if (!canBeDownloaded)  error.push(API_ERRORS.canBeDownloaded.NOT_FIND);

    if (!publicationDate)  error.push(API_ERRORS.publicationDate.NOT_FIND);

    if (canBeDownloaded && !isBoolean(canBeDownloaded))  error.push(API_ERRORS.canBeDownloaded.NOT_A_BOOLEAN);

    if (publicationDate && !isString(publicationDate))  error.push(API_ERRORS.publicationDate.NOT_A_STRING);

    if (minAgeRestriction && !isNumber(minAgeRestriction))  error.push(API_ERRORS.minAgeRestriction.NOT_A_NUMBER);

    if ( minAgeRestriction !== null && ( minAgeRestriction < 1 || minAgeRestriction > 18 ) ) error.push(API_ERRORS.minAgeRestriction.NOT_CORRECT);

    if (error.length > 0) {
        if (req.errorsMessages) {
             req.errorsMessages.errorsMessages = [ ...req.errorsMessages.errorsMessages, ...errorsMessages.errorsMessages];
        } else {
            req.errorsMessages = errorsMessages;
        }
    } 

   return next();
};
