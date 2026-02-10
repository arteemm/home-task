import { errorsHandler } from '../../../middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { API_ERRORS } from '../../../core/constants/apiErrors';


export const updateBlogValidation = [
    body('name').notEmpty().withMessage(API_ERRORS.name.NOT_FIND.message),
    body('description').notEmpty().withMessage(API_ERRORS.description.NOT_FIND.message),
    body('websiteUrl').notEmpty().withMessage(API_ERRORS.websiteUrl.NOT_FIND.message),
    body('name').isString().withMessage(API_ERRORS.name.NOT_A_STRING.message),
    body('description').isString().withMessage(API_ERRORS.description.NOT_A_STRING.message),
    body('websiteUrl').isString().withMessage(API_ERRORS.websiteUrl.NOT_A_STRING.message),
    body(['name']).isLength({ min: 1, max: 15 }).withMessage(API_ERRORS.name.IS_TOO_LONG.message),
    body(['description']).isLength({ min: 1, max: 500 }).withMessage(API_ERRORS.description.IS_TOO_LONG.message),
    body(['websiteUrl']).isLength({ min: 1, max: 100 }).withMessage(API_ERRORS.websiteUrl.IS_TOO_LONG.message),
    body(['websiteUrl']).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage(API_ERRORS.websiteUrl.NOT_CORRECT.message),
    errorsHandler
];
