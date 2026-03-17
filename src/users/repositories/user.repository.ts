import { IUserDB } from '../types/userDBInterface';
import { usersCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';


export class UsersRepository {
   async findById(id: string): Promise<WithId<IUserDB> | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return usersCollection.findOne({_id: new ObjectId(id)});
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<IUserDB> | null>{
        return usersCollection.findOne({
            $or: [{ userName: loginOrEmail }, { email: loginOrEmail }],
        });
    }

    async create(newEntity: IUserDB): Promise<string> {
        const insertResalt = await usersCollection.insertOne(newEntity);

        return insertResalt.insertedId.toString();
    }

    async findByConfirmationCode (code: string): Promise<WithId<IUserDB> | null>{
        return usersCollection.findOne({ 'emailConfirmation.condirmationCode': code });
    }

    async updateConfirmationStatus(id: string): Promise<void> {
        const matchesResalt = await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: { 'emailConfirmation.isConfirmed': true }}
        );

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async updateConfirmationCode(id: string, code: string, expirationDate: Date ): Promise<void> {
        const matchesResalt = await usersCollection.updateOne({_id: new ObjectId(id)}, { $set: {
                    'emailConfirmation.condirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate,
                }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }


    async delete(id: string): Promise<void> {
        const deletedBlog = await usersCollection.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
}
