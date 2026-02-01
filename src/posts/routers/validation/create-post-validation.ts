import { errorsHandler } from '../../../middlewares/errorsHandlerMiddleware';
import { body } from 'express-validator';
import { db } from '../../../db/in-memory.db';


export const createPostsValidation = [
    body(['title', 'shortDescription', 'content', 'blogId']).notEmpty().withMessage('something is empty'),
    body(['title', 'shortDescription', 'content', 'blogId']).isString().withMessage('is not a string'),
    body(['title']).isLength({ min: 1, max: 30 }).withMessage('length more than 30 symbols'),
    body(['shortDescription']).isLength({ min: 1, max: 100 }).withMessage('length more than 100 symbols'),
    body(['content']).isLength({ min: 1, max: 1000 }).withMessage('length more than 1000 symbols'),
    body(['blogId']).custom((value, { req }) => {
        return (db.blogs.find(blog => blog.id === value)) ? true : false;
    }).withMessage('blog id did not find'),
    errorsHandler
];
