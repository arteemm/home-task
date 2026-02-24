import { errorsHandler } from '../../core/middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { API_ERRORS } from '../../core/constants/apiErrors';


const titleValidation = body('title')
    .notEmpty()
    .withMessage(API_ERRORS.title.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.title.NOT_A_STRING.message)
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(API_ERRORS.title.IS_TOO_LONG.message);

const shortDescriptionValidation = body('shortDescription')
    .notEmpty()
    .withMessage(API_ERRORS.shortDescription.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.shortDescription.NOT_A_STRING.message)
    .isLength({ min: 1, max: 100 })
    .withMessage(API_ERRORS.shortDescription.IS_TOO_LONG.message);

const contentValidation = body('content')
    .notEmpty()
    .withMessage(API_ERRORS.content.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.content.NOT_A_STRING.message)
    .isLength({ min: 1, max: 1000 })
    .withMessage(API_ERRORS.content.IS_TOO_LONG.message);

const blogIdValidation = body('blogId')
    .notEmpty()
    .withMessage(API_ERRORS.blogId.NOT_FIND.message)
    .isString()
    .withMessage(API_ERRORS.blogId.NOT_A_STRING.message)
    .custom(async (value, { req }) => {
        const blog = await (blogsRepository.findById(value));
        if (!blog) {
            throw new Error('API_ERRORS.blogId.NOT_FIND_BLOG_ID');
        }
    })
    .withMessage(API_ERRORS.blogId.NOT_FIND_BLOG_ID.message);



export const createPostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    errorsHandler
];

export const updatePostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    errorsHandler
];

export const createPostInBlogValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    errorsHandler
];
