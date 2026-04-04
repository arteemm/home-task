import mongoose, { HydratedDocument, model, Model } from 'mongoose'
import { IPostDB } from '../../types/postDBinterface'

export const PostSchema = new mongoose.Schema<IPostDB>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },

});

type PostModel = Model<IPostDB>;
export type PostDocument = HydratedDocument<IPostDB>;

export const PostModel = model<IPostDB, PostModel>('posts', PostSchema);

