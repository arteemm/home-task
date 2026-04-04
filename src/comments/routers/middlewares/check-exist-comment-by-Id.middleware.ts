import { Request, Response, NextFunction  } from 'express';
import { CommentsQueryRepository } from '../../repositories/comment.query.repository';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { container } from '../../../ioc/composition-root';


const commentsQueryRepository = container.resolve(CommentsQueryRepository);

export async function checkExistCommentByIdMiddleware (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id.toString();
    const comment = await commentsQueryRepository.findById(id);

    if (!comment) {
        res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        return;
    }

    next();
    return;
};
