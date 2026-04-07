import mongoose, { HydratedDocument, model, Model, InferSchemaType } from 'mongoose'
import { ICommentDB } from '../../types/commentsDBInterface'

export const CommentSchema = new mongoose.Schema<ICommentDB>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
});

type CommentModel = Model<ICommentDB>;
export type CommentDocument = HydratedDocument<ICommentDB>;
export const CommentModel = model<ICommentDB, CommentModel>('comments', CommentSchema);

