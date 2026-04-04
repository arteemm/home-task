import { IUserDB } from '../types/userDBInterface';
import { WithId, ObjectId, Collection } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { UserModel, UserDocument } from '../infrastructure/mongoose/user.shema';


@injectable()
export class UsersRepository {
    // constructor(@inject(TYPES.UsersCollection) private usersCollection: Collection<UserDocument>) {}

    async findById(id: string): Promise<WithId<IUserDB> | null>{
            if (!ObjectId.isValid(id)) {
                return new Promise((res, rej) => {
                    res(null)
                });
            }

            return UserModel.findOne({_id: new ObjectId(id)});
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<IUserDB> | null>{
        return UserModel.findOne({
            $or: [{ userName: loginOrEmail }, { email: loginOrEmail }],
        });
    }

    async create(user: UserDocument): Promise<string> {
        const insertResalt = await user.save();

        return insertResalt._id.toString();
    }

    async findByConfirmationCode (code: string): Promise<WithId<IUserDB> | null>{
        return UserModel.findOne({ 'emailConfirmation.condirmationCode': code });
    }

    async findByRecoveryCode (code: string): Promise<WithId<IUserDB> | null>{
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    async updateConfirmationStatus(id: string): Promise<void> {
        const matchesResalt = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: { 'emailConfirmation.isConfirmed': true }}
        );

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async updateConfirmationCode(id: string, code: string, expirationDate: Date ): Promise<void> {
        const matchesResalt = await UserModel.updateOne({_id: new ObjectId(id)}, { $set: {
                    'emailConfirmation.condirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate,
                }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async delete(id: string): Promise<void> {
        const deletedBlog = await UserModel.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async updateRecoveryCode(id: string, code: string, expirationDate: Date ): Promise<void> {
        const matchesResalt = await UserModel.updateOne({_id: new ObjectId(id)}, { $set: {
                    'passwordRecovery.recoveryCode': code,
                    'passwordRecovery.recoveryExpirationDate': expirationDate,
                    'passwordRecovery.isRecovered': false
                }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async updatePassword(userId:string, newHash: string, newSalt: string): Promise<void> {
        const matchesResalt = await UserModel.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {
                'passwordHash': newHash,
                'passwordSalt': newSalt,
                'passwordRecovery.isRecovered': true 
            }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
}
