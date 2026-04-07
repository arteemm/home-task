import mongoose, { HydratedDocument, model, Model, InferSchemaType } from 'mongoose'
import { IBlogDB } from '../../types/blogDBinterface'

export const BlogSchema = new mongoose.Schema<IBlogDB>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
});

type BlogModel = Model<IBlogDB>;
export type BlogDocument = HydratedDocument<IBlogDB>;
export const BlogModel = model<IBlogDB, BlogModel>('blogs', BlogSchema);

