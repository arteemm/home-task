import { errorsHandler } from '../../../middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { API_ERRORS } from '../../../core/constants/apiErrors';


export const createPostsValidation = [
    body('title').notEmpty().withMessage(API_ERRORS.title.NOT_FIND.message),
    body('shortDescription').notEmpty().withMessage(API_ERRORS.shortDescription.NOT_FIND.message),
    body('content').notEmpty().withMessage(API_ERRORS.content.NOT_FIND.message),
    body('blogId').notEmpty().withMessage(API_ERRORS.blogId.NOT_FIND.message),
    body('title').isString().withMessage(API_ERRORS.title.NOT_A_STRING.message),
    body('shortDescription').isString().withMessage(API_ERRORS.shortDescription.NOT_A_STRING.message),
    body('content').isString().withMessage(API_ERRORS.content.NOT_A_STRING.message),
    body('blogId').isString().withMessage(API_ERRORS.blogId.NOT_A_STRING.message),
    body(['title']).isLength({ min: 1, max: 30 }).withMessage(API_ERRORS.title.IS_TOO_LONG.message),
    body(['shortDescription']).isLength({ min: 1, max: 100 }).withMessage(API_ERRORS.shortDescription.IS_TOO_LONG.message),
    body(['content']).isLength({ min: 1, max: 1000 }).withMessage(API_ERRORS.content.IS_TOO_LONG.message),
    body(['blogId']).custom(async (value, { req }) => {
        const blog = await (blogsRepository.findById(value));
        if (!blog) {
            throw new Error('API_ERRORS.blogId.NOT_FIND_BLOG_ID');
        }
    }).withMessage(API_ERRORS.blogId.NOT_FIND_BLOG_ID.message),
    errorsHandler
];
