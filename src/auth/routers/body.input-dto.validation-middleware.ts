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

const newPasswordStringValidation = body('newPassword')
    .notEmpty()
    .withMessage(API_ERRORS.newPassword.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.newPassword.NOT_A_STRING.message)
    .isLength({ min: 6, max: 20})
    .withMessage(API_ERRORS.newPassword.IS_TOO_LONG.message);

const codeValitadion = body('code')
    .notEmpty()
    .withMessage(API_ERRORS.code.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.code.NOT_A_STRING.message)

const emailValidation = body('email')
    .notEmpty()
    .withMessage(API_ERRORS.email.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.email.NOT_A_STRING.message)
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage(API_ERRORS.email.NOT_CORRECT.message)

const recoveryCodeValitadion = body('recoveryCode')
    .notEmpty()
    .withMessage(API_ERRORS.recoveryCode.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.recoveryCode.NOT_A_STRING.message)

export const loginUserValidation = [
    loginOrEmailValidation,
    passwordValidation,
    errorsHandler
];

export const confirmationCodeValidation = [
    codeValitadion,
    errorsHandler
];

export const resendingEmailValidation = [
    emailValidation,
    errorsHandler
];

export const newPasswordValidation = [
    recoveryCodeValitadion,
    newPasswordStringValidation,
    errorsHandler
]