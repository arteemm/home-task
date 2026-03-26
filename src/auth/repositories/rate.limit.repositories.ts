import { rateLimitCollection } from '../../repositories/db';
import { RateLimitData, RateLimitDataList } from '../types/rate-limt-data';
import { WithId } from 'mongodb';


export const rateLimitRepository = {
    async getLimitsByUrlAndIp(limitId: string): Promise<WithId<RateLimitDataList> | null> {
        const result = await rateLimitCollection.findOne({limitId: limitId});

        if(!result) {
            return null;
        }

        return result;
    },

    async createLimitsArray(limitId: string, data: RateLimitData): Promise<string> {
        const result = await rateLimitCollection.insertOne({
            limitId: limitId,
            rateLimits: [data]
        });

        return result.insertedId.id.toString();
    },

    async updateLastActiveDate(limitId: string, data: RateLimitData): Promise<WithId<RateLimitDataList> | null> {
        try {
            await rateLimitCollection.updateOne({limitId: limitId}, {
                $push: {rateLimits: data}
            });

            return await this.getLimitsByUrlAndIp(limitId);
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in update last active session');
        }
    },

    async deleteAllActivities(limitId: string): Promise<void> {
        try {
            await rateLimitCollection.updateOne({limitId: limitId}, {
                $set: { rateLimits: [] }
            });
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in delete last active session');
        }
    }
};
