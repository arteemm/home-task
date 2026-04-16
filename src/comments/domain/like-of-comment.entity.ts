import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { LikeStatusType } from '../types/like-status.dto';


type LikeOfComment = {
    commentId: string;
    likesListofComment: LikeOfCommentInfo[];
};

export type LikeOfCommentInfo = {
    likeStatus: LikeStatusType,
    postId: string;
    userId: string;
    createdAt: string;
};

type LikeOfCommentModel = Model<LikeOfComment, {}, LikeofCommentMethods> & LikeofCommentStatic;

export type LikeofCommentDocument = HydratedDocument<LikeOfComment, LikeofCommentMethods>;

export const LikeInfoSchema = new mongoose.Schema<LikeOfCommentInfo>({
    likeStatus: { type: String, required: true },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: String, required: true },
});

export const LikeOfCommentSchema = new mongoose.Schema<LikeOfComment, LikeOfCommentModel>({
    commentId: { type: String, required: true },
    likesListofComment: [LikeInfoSchema],
});

interface LikeofCommentStatic {
    createLikeOfComment(commentId : string, likeStatus: LikeStatusType, postId: string, userId: string): LikeofCommentDocument;
}

interface LikeofCommentMethods {
    updateLikeofCommenByUser(likeStatus: LikeStatusType, userId: string): void;
    addLikeInfoByUserId(likeStatus: LikeStatusType, postId: string, userId: string): void
}


export class LikeOfCommentEntity {
    private constructor(
        public commentId: string,
        public likesListofComment: LikeOfCommentInfo[],
    ) {}

    updateLikeofCommenByUser(likeStatus: LikeStatusType, userId: string): void {
        const userLikeStatusIndex = this.likesListofComment.findIndex(item => item.userId === userId);
        this.likesListofComment[userLikeStatusIndex].likeStatus = likeStatus;
    }

    addLikeInfoByUserId(likeStatus: LikeStatusType, postId: string, userId: string): void {
        this.likesListofComment.push({
                likeStatus: likeStatus,
                postId: postId,
                userId: userId,
                createdAt: new Date().toISOString(),
        })
    }
}

LikeOfCommentSchema.loadClass(LikeOfCommentEntity);

LikeOfCommentSchema.static('createLikeOfComment', function(commentId : string, likeStatus: LikeStatusType, postId: string, userId: string): LikeofCommentDocument {
        const likeInfo: LikeOfCommentInfo = {
            likeStatus: likeStatus,
            postId: postId,
            userId: userId,
            createdAt: new Date().toISOString(),
        }

        const likeOfComment = new LikeOfCommentModel({commentId: commentId, likesListofComment: [likeInfo]});


        return likeOfComment;
    });

export const LikeOfCommentModel = model<LikeOfComment, LikeOfCommentModel>('like-of-comments', LikeOfCommentSchema);