import { errorsHandler } from '../../core/middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { API_ERRORS } from '../../core/constants/apiErrors';


const contentValidation = body('content')
    .notEmpty()
    .withMessage(API_ERRORS.content.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.content.NOT_A_STRING.message)
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage(API_ERRORS.content.IS_TOO_LONG.message);

const likeStatusValidation = body('likeStatus')
    .notEmpty()
    .withMessage(API_ERRORS.likeStatus.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.likeStatus.NOT_A_STRING.message)
    .trim()
    .isIn(['None' , 'Like' , 'Dislike'])
    .withMessage(API_ERRORS.likeStatus.MUST_BE_ONLY.message);

export const createCommentValidation = [
    contentValidation,
    errorsHandler
];

export const updateCommentValidation = [
    contentValidation,
    errorsHandler
];

export const likeStatusValidationErr = [
    likeStatusValidation,
    errorsHandler
];