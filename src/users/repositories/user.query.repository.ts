import { IUserDB } from '../types/userDBInterface';
import { UserQueryInput } from '../types/user-query-input';
import { UserViewModel } from '../types/user-view-model';
import { usersCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';


export const usersQueryRepository = {
    async findAll(queryDto: UserQueryInput): Promise<{ items: UserViewModel[]; totalCount: number }> {
        const {
            searchLoginTerm,
            searchEmailTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (+pageNumber - 1) * +pageSize;
        const filter: any = {};

        if (searchLoginTerm) {
            filter.login = {$regex : `${searchLoginTerm}`, $options: 'i'};
        }

        if (searchEmailTerm) {
            filter.email = {$regex : `${searchEmailTerm}`, $options: 'i'};
        }

        const items = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray(); 

        const totalCount = await usersCollection.countDocuments(filter);
        return { items: this._mapToListUsersViewModel(items), totalCount};
    },

   async findById(id: string): Promise<UserViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const userDB = await usersCollection.findOne({_id: new ObjectId(id)});

        return userDB ? this._mapToUserViewModel(userDB) : null;
    },

    async findByRecoveryCode (code: string): Promise<WithId<IUserDB> | null>{
        return usersCollection.findOne({ 'passwordRecovery.recoveryCode': code });
    },

    _mapToUserViewModel(data: WithId<IUserDB>): UserViewModel {
        return {
            id: data._id.toString(),
            login: data.userName,
            email: data.email,
            createdAt: data.createdAt,
        }
    },

    _mapToListUsersViewModel(data: WithId<IUserDB>[]): UserViewModel[] {
        return data.map((item: WithId<IUserDB>) => {
            return {
                id: item._id.toString(),
                login: item.userName,
                email: item.email,
                createdAt: item.createdAt,
            };
        });
    },

    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
};
