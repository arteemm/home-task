import { IUserDB } from '../types/userDBInterface';
import { UserQueryInput } from '../types/user-query-input';
import { UserViewModel } from '../types/user-view-model';
import { WithId, ObjectId, Collection } from 'mongodb';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { UserModel, UserDocument } from '../infrastructure/mongoose/user.shema';


@injectable()
export class UsersQueryRepository  {
    constructor() {}

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

        const items = await UserModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .lean(); 

        const totalCount = await UserModel.countDocuments(filter);
        return { items: this._mapToListUsersViewModel(items), totalCount};
    }

   async findById(id: string): Promise<UserViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const userDB = await UserModel.findOne({_id: new ObjectId(id)});

        return userDB ? this._mapToUserViewModel(userDB) : null;
    }

    async findByRecoveryCode (code: string): Promise<WithId<IUserDB> | null>{
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    _mapToUserViewModel(data: WithId<IUserDB>): UserViewModel {
        return {
            id: data._id.toString(),
            login: data.userName,
            email: data.email,
            createdAt: data.createdAt,
        }
    }

    _mapToListUsersViewModel(data: WithId<IUserDB>[]): UserViewModel[] {
        return data.map((item: WithId<IUserDB>) => {
            return {
                id: item._id.toString(),
                login: item.userName,
                email: item.email,
                createdAt: item.createdAt,
            };
        });
    }

    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
};
