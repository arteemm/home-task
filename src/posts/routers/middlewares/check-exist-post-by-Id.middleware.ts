import { Request, Response, NextFunction  } from 'express';
import { PostsQueryRepository } from '../../repositories/post.query.repository';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { container } from '../../../ioc/composition-root';


const postsQueryRepository: PostsQueryRepository = container.resolve(PostsQueryRepository);

export async function checkExistPostByIdMiddleware (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id.toString();
    const post = await postsQueryRepository.findById(id);

    if (!post) {
        res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        return;
    }

    next();
    return;
};
