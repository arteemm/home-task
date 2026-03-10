import { Request, Response, NextFunction  } from 'express';
import { postsQueryRepository } from '../../repositories/post.query.repository';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


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
