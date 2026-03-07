import { errorsHandler } from '../../core/middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { API_ERRORS } from '../../core/constants/apiErrors';


const loginOrEmailValidation = body('loginOrEmail')
    .notEmpty()
    .withMessage(API_ERRORS.loginOrEmail.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.loginOrEmail.NOT_A_STRING.message)
    .trim()
    .isLength({ min: 1, max: 1500 })
    .withMessage(API_ERRORS.loginOrEmail.IS_TOO_LONG.message);

const passwordValidation = body('password')
    .notEmpty()
    .withMessage(API_ERRORS.password.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.password.NOT_A_STRING.message)
    .isLength({ min: 1, max: 5000})
    .withMessage(API_ERRORS.password.IS_TOO_LONG.message);


export const loginUserValidation = [
    loginOrEmailValidation,
    passwordValidation,
    errorsHandler
];

