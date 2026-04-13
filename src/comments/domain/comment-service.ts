import { CommentRepository } from '../repositories/comment.repository';
import { CommentsQueryRepository } from '../repositories/comment.query.repository';
import { inject, injectable } from 'inversify';
import { LikeStatusType } from '../types/like-status.dto';
import { LikeOfCommentInfo, LikeOfCommentModel } from '../domain/like-of-comment.entity';


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
            const comment = await this.commentRepository.findById(commentId);
            
            if(!likesList) {
                const newLike = LikeOfCommentModel.createLikeOfComment(commentId, data.likeStatus, comment!.postId, userId)
                await this.commentRepository.saveLike(newLike);
            }

            const likeOfCommentbyUser = await this.commentsQueryRepository.findLikeByCommentIdAndUserId(commentId, userId);
            const likesListExisting = await this.commentsQueryRepository.findLikesListByCommentId(commentId);

            if (!likesListExisting) {
                throw new Error('likesListExisting is nit existing')
            }
            
            if (!likeOfCommentbyUser) {
                likesListExisting!.addLikeInfoByUserId(data.likeStatus, comment!.postId, userId);
            }

            likesListExisting!.updateLikeofCommenByUser(data.likeStatus, userId)

            await this.commentRepository.saveLike(likesListExisting);
        } catch(e) {
           throw new Error('something wrong in updateLikeStatus SErvice');
        }     
    }

    async delete(id: string): Promise<void> {
        return this.commentRepository.delete(id);
    }
};
