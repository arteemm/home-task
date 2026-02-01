import { errorsHandler } from '../../../middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';


export const createBlogValidation = [
    body(['name', 'description', 'websiteUrl']).notEmpty().withMessage('something is empty'),
    body(['name', 'description', 'websiteUrl']).isString().withMessage('is not a string'),
    body(['name']).isLength({ min: 1, max: 15 }).withMessage('length more than 15 symbols'),
    body(['description']).isLength({ min: 1, max: 500 }).withMessage('length more than 500 symbols'),
    body(['websiteUrl']).isLength({ min: 1, max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('length more than 100 symbols'),
    errorsHandler
];
