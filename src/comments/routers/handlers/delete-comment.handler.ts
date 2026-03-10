import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { commentsQueryRepository } from '../../repositories/comment.query.repository';
import { commentsService } from '../../domain/comment-service';

export async function deleteCommentHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        await commentsService.delete(id);
    
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
