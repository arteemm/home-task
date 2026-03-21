import { ObjectId, Collection } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { ExpiredRefreshTokents } from '../types/expired-refresh-tokens';


export class AuthRepository {
    constructor(private expiredRefreshTokentsCollection: Collection<ExpiredRefreshTokents>) {}

    async create(newEntity: ExpiredRefreshTokents): Promise<string> {
        const insertResalt = await this.expiredRefreshTokentsCollection.insertOne(newEntity);
        return insertResalt.insertedId.toString();
    }

    async update(userId: string, refreshToken: string): Promise<void> {
        const matchesResalt = await this.expiredRefreshTokentsCollection.updateOne({userId: userId}, {$push: {
            blackListTokens: refreshToken,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    // async delete(id: string): Promise<void> {
    //     const deletedBlog = await commentsCollection.deleteOne({_id: new ObjectId(id)})

    //     if (deletedBlog.deletedCount < 1) {
    //         throw new Error(API_ERRORS.id_not_exist);
    //     }
    // }
};
