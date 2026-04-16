import { UserQueryInput } from '../types/user-query-input';
import { UserViewModel } from '../types/user-view-model';
import { WithId, ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import { UserModel, UserDocument } from '../domain/user.entity';


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
            // .lean(); 

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

    async findByRecoveryCode (code: string): Promise<WithId<UserDocument> | null>{
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    _mapToUserViewModel(data: WithId<UserDocument>): UserViewModel {
        return {
            id: data._id.toString(),
            login: data.userName,
            email: data.email,
            createdAt: data.createdAt,
        }
    }

    _mapToListUsersViewModel(data: WithId<UserDocument>[]): UserViewModel[] {
        return data.map((item: WithId<UserDocument>) => {
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
