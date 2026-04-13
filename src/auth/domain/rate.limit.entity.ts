import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { API_ERRORS } from '../../core/constants/apiErrors';


type RateLimit = {
    limitId: string;
    rateLimits: RateLimitData[];
};

export type RateLimitData = {
    ip: string,
    url: string;
    date: Date;
};

type RateLimitModel = Model<RateLimit, {}, RateLimitMethods> & RateLimitStatic;

export type RateLimitDocument = HydratedDocument<RateLimit, RateLimitMethods>;

export const RateLimitDataSchema = new mongoose.Schema<RateLimitData>({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true },
});

export const RateLimitSchema = new mongoose.Schema<RateLimit, RateLimitModel>({
    limitId: { type: String, required: true },
    rateLimits: { type: [RateLimitDataSchema], required: true, default: [] },
});

interface RateLimitStatic {
    createRateLimit(dto: RateLimitData): RateLimitDocument;
    createLimitId(ip: string, url: string): string;
}

interface RateLimitMethods {
    returnFirstRateLimitData(): RateLimitData;
}

export class RateLimitEntity {
    constructor(
        public limitId: string,
        public rateLimits: RateLimitData[],

    ) {}

    returnFirstRateLimitData() {
        return this.rateLimits[0];
    }
}

RateLimitSchema.loadClass(RateLimitEntity);

RateLimitSchema.static('createRateLimit', function(dto: RateLimitData): RateLimitDocument {
        const limitId = Buffer.from(dto.ip + dto.url).toString('base64')
        const rateLimitData: RateLimitData = {
            ip: dto.ip,
            url: dto.url,
            date: dto.date,
        };
        
        const rateLimit = new RateLimitModel({limitId: limitId, rateLimits: [rateLimitData]});

        return rateLimit;
});

RateLimitSchema.static('createLimitId', function(ip: string, url: string): string {
        return Buffer.from(ip + url).toString('base64')
});

export const RateLimitModel = model<RateLimit, RateLimitModel>('rate-limits', RateLimitSchema);
