import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { CommentsQueryRepository } from '../repositories/comment.query.repository';
import { CommentViewModel } from '../types/commentViewModel';
import { inject, injectable } from 'inversify';
import { CommentsService } from '../domain/comment-service';
import { LikeStatusType } from '../types/like-status.dto';
import { getLikesInfoAddapter } from '../adapters/get-likes-info-adapter';


@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsQueryRepository) protected commentsQueryRepository:  CommentsQueryRepository,
        @inject(CommentsService) protected commentsService:  CommentsService,
    ) {}

    async  getCommentByIdHandler(req: Request, res: Response<CommentViewModel>) {
        try {
            const id = req.params.id.toString();
            const commentById = await this.commentsQueryRepository.findById(id);

            if (commentById === null) {
                res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
                return;
            }

            const likesInfo = await getLikesInfoAddapter(commentById.id, req, this.commentsQueryRepository);
            commentById.likesInfo = likesInfo;
            res.status(HttpResponceCodes.OK_200).send(commentById);
        } catch(e: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async updateCommentHandler(req: Request, res: Response) {
        try {
            const id = req.params.id.toString();
    
            await this.commentsService.update(id, req.body);
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        }  catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async updateLikeStatus(req: Request<{id: string, userId: string}, {}, {likeStatus: LikeStatusType}, {}>, res: Response) {
        try {
            const commentId = req.params.id.toString();
            const userId = req.userId as string;
            
            await this.commentsService.updateLikeStatus(commentId, userId, req.body);
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        }  catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async deleteCommentHandler(req: Request, res: Response) {
        try {
            const id = req.params.id.toString();
            await this.commentsService.delete(id);
        
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }
}