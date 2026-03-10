import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { commentsQueryRepository } from '../../repositories/comment.query.repository';
import { CommentViewModel } from '../../types/commentViewModel';


export async function getCommentByIdHandler(req: Request, res: Response<CommentViewModel>) {
    try {
        const id = req.params.id.toString();
        const commentById = await commentsQueryRepository.findById(id);

        if (commentById === null) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        res.status(HttpResponceCodes.OK_200).send(commentById);
    } catch(e: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
