import { Request, Response, NextFunction  } from 'express';
import { blogsQueryRepository } from '../../repositories/blogs.query.repositories';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export async function checkExistBlogByIdMiddleware (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id.toString();
    const post = await blogsQueryRepository.findById(id);

    if (!post) {
        res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        return;
    }

    next();
    return;
};
