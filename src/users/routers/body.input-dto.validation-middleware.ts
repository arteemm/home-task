import { errorsHandler } from '../../core/middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { API_ERRORS } from '../../core/constants/apiErrors';


const loginValidation = body('login')
    .notEmpty()
    .withMessage(API_ERRORS.login.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.login.NOT_A_STRING.message)
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage(API_ERRORS.login.IS_TOO_LONG.message)
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage(API_ERRORS.login.NOT_CORRECT.message);


const passwordValidation = body('password')
    .notEmpty()
    .withMessage(API_ERRORS.password.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.password.NOT_A_STRING.message)
    .isLength({ min: 6, max: 20 })
    .withMessage(API_ERRORS.password.IS_TOO_LONG.message);

const emailValidation = body('email')
    .notEmpty()
    .withMessage(API_ERRORS.email.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.email.NOT_A_STRING.message)
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage(API_ERRORS.login.NOT_CORRECT.message)


export const createUserValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    errorsHandler
];
