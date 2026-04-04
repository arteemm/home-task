import mongoose, { HydratedDocument, model, Model, InferSchemaType } from 'mongoose';
import { IRateLimitDB } from '../../types/rate-limt-interface';

export const RateLimitSchema = new mongoose.Schema<IRateLimitDB>({
    limitId: { type: String, required: true },
    rateLimits: { type: [{
        ip: { type: String, required: true },
        URL: { type: String, required: true },
        date: { type: Date, required: true }
    }], required: true },
});

type RateLimitModel = Model<IRateLimitDB>;
export type RateLimitDocument = HydratedDocument<IRateLimitDB>;
export const RateLimitModel = model<IRateLimitDB, RateLimitModel>('rate-limit', RateLimitSchema);
