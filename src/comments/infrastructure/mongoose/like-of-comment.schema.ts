import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { ILikeOfCommentDB } from '../../types/likeOfCommentInterface';
import { LikeofCommentInfo } from '../../domain/like-of-comment.entity';

export const LikeInfoSchema = new mongoose.Schema<LikeofCommentInfo>({
    likeStatus: { type: String, required: true },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: String, required: true },
});

export const LikeOfCommentSchema = new mongoose.Schema<ILikeOfCommentDB>({
    commentId: { type: String, required: true },
    likesListofComment: [LikeInfoSchema],
});

type LikeOfCommentModel = Model<ILikeOfCommentDB>;
export type LikeOfCommentDocument = HydratedDocument<ILikeOfCommentDB>;
export type LikeInfoSchemaDocument = HydratedDocument<LikeofCommentInfo>;
export const LikeOfCommentModel = model<ILikeOfCommentDB, LikeOfCommentModel>('like-of-comments', LikeOfCommentSchema);
