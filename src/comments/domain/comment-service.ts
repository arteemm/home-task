import { CommentRepository } from '../repositories/comment.repository';
import { CommentsQueryRepository } from '../repositories/comment.query.repository';
import { inject, injectable } from 'inversify';
import { LikeStatusType } from '../types/like-status.dto';
import { LikeOfComment } from '../domain/like-of-comment.entity';
import { LikeOfCommentModel } from '../infrastructure/mongoose/like-of-comment.schema';


injectable()
export class CommentsService {
    constructor(
        @inject(CommentRepository) protected commentRepository: CommentRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async update(id: string, data: { content: string }): Promise<void> {
        return this.commentRepository.update(id, data);
    }

    async updateLikeStatus(commentId: string, userId: string, data: {likeStatus: LikeStatusType}): Promise<void> {
        try {
            const likesList = await this.commentsQueryRepository.findLikesListByCommentId(commentId);
            
            if(!likesList) {
                const likeInstance = LikeOfComment.create(commentId, 'Dislike', '1111', userId);
                const like = new LikeOfCommentModel(likeInstance);
                await this.commentRepository.createLike(like);
            }

            const likeOfCommentbyUser = await this.commentsQueryRepository.findLikeByCommentIdAndUserId(commentId, userId);
 
            
            if (!likeOfCommentbyUser) {
                return this.commentRepository.addLikeInfoByUserId(commentId, userId, data.likeStatus, '333');
            }


            return this.commentRepository.updateLikeStatus(commentId, userId, data.likeStatus);
        } catch(e) {
           throw new Error('something wrong in updateLikeStatus SErvice');
        }     
    }

    async delete(id: string): Promise<void> {
        return this.commentRepository.delete(id);
    }
};
