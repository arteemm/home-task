import { errorsHandler } from '../../core/middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { API_ERRORS } from '../../core/constants/apiErrors';


const nameValidation = body('name')
    .notEmpty()
    .withMessage(API_ERRORS.name.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.name.NOT_A_STRING.message)
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage(API_ERRORS.name.IS_TOO_LONG.message);

const descriptionValidation = body('description')
    .notEmpty()
    .withMessage(API_ERRORS.description.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.description.NOT_A_STRING.message)
    .isLength({ min: 1, max: 500 })
    .withMessage(API_ERRORS.description.IS_TOO_LONG.message);

const websiteUrlValidation = body('websiteUrl')
    .notEmpty()
    .withMessage(API_ERRORS.websiteUrl.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.websiteUrl.NOT_A_STRING.message)
    .isLength({ min: 1, max: 100 })
    .withMessage(API_ERRORS.websiteUrl.IS_TOO_LONG.message)
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage(API_ERRORS.websiteUrl.NOT_CORRECT.message)


export const createBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    errorsHandler
];

export const updateBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    errorsHandler
];
