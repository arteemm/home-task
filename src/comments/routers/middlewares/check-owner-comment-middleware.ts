import { Request, Response, NextFunction  } from 'express';
import { commentsQueryRepository } from '../../repositories/comment.query.repository';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export async function checOwnerCommentMiddleware (req: Request, res: Response, next: NextFunction) {
    const commentId = req.params.id.toString();
    const comment = await commentsQueryRepository.findById(commentId);
    const ownerId = comment?.commentatorInfo.userId;
    const userId = req.userId;

    if (userId !== ownerId) {
        res.sendStatus(HttpResponceCodes.FORBIDDEN_403);
        return;
    }

    next();
    return;
};
