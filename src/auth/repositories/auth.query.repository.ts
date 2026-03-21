import { expiredRefreshTokentsCollection } from '../../repositories/db';


export const authQueryRepository = {
   async checkRefreshTokenByUserId(userId: string, refreshToken: string): Promise<true | false>{
        const isInBlackList = await expiredRefreshTokentsCollection.findOne({$and: [
            {userId: userId},
            {blackListTokens: { $in: [refreshToken]}}
        ]});

        return isInBlackList ? true : false;
    },

    async checExistingUserInBlackList(userId: string): Promise<true | false> {
        const isInBlackList = await expiredRefreshTokentsCollection.findOne({userId: userId});

        return isInBlackList ? true : false;
    }
};
