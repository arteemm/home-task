import { Request, Response, NextFunction  } from 'express';
import { BlogsQueryRepository } from '../../repositories/blogs.query.repositories';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { container } from '../../../ioc/composition-root';


const blogsQueryRepository: BlogsQueryRepository = container.resolve(BlogsQueryRepository);

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
