import { RateLimitDocument, RateLimitModel } from '../infrastructure/mongoose/rate.limit.shema';
import { WithId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IRateLimitDB } from '../types/rate-limt-interface';
import { RateLimitData } from '../domain/rate.limit.entity';


@injectable()
export class RateLimitRepository {
    constructor(){}

    async getLimitsByUrlAndIp(limitId: string): Promise<IRateLimitDB | null> {
        const result = await RateLimitModel.findOne({limitId: limitId});

        if(!result) {
            return null;
        }

        return result;
    }

    async createLimitsArray(data: RateLimitDocument): Promise<string> {
        const result = await data.save();

        return result._id.toString();
    }

    async updateLastActiveDate(limitId: string, data: RateLimitData): Promise<RateLimitDocument | null> {
        const rateLimit = await RateLimitModel.findOne({limitId: limitId});

        if (!rateLimit) {
            throw new Error('something in updateLastActiveDate');
        }

        try {
            rateLimit.rateLimits.push(data);
            await rateLimit.save();

            return rateLimit;
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in update last active session');
        }
    }

    async deleteAllActivities(limitId: string): Promise<void> {
        const rateLimit = await RateLimitModel.findOne({limitId: limitId});

        if (!rateLimit) {
            throw new Error('something in deleteAllActivities');
        }

        try {
            rateLimit.rateLimits = [];
            await rateLimit.save();
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in delete last active session');
        }
    }
};
