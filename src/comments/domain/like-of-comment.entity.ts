import { LikeStatusType } from '../types/like-status.dto';

export class LikeOfComment {
    constructor(
        public commentId: string,
        public likesListofComment: LikeofCommentInfo[],
    ) {}

    static create(commentId: string, likeStatus: LikeStatusType, postId: string, userId: string): LikeOfComment {
        return new this(
            commentId,
            [{
                likeStatus: likeStatus,
                postId: postId,
                userId: userId,
                createdAt: new Date().toISOString(),
            }],            
        )
    }
}

export type LikeofCommentInfo = {
    likeStatus: LikeStatusType,
    postId: string;
    userId: string;
    createdAt: string;
};
