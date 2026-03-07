import { UserDBtype } from '../types/userDBtype';
import { usersCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';


export const usersRepository = {
   async findById(id: string): Promise<WithId<UserDBtype> | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return usersCollection.findOne({_id: new ObjectId(id)});
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBtype> | null>{
        return usersCollection.findOne({
            $or: [{ userName: loginOrEmail }, { email: loginOrEmail }],
        });
    },

    async create(newEntity: UserDBtype): Promise<string> {
        const insertResalt = await usersCollection.insertOne(newEntity);

        return insertResalt.insertedId.toString();
    },

    // async update(id: string, blogParam: ChangeBlog): Promise<void> {
    //     const matchesResalt = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {
    //         name: blogParam.name,
    //         description: blogParam.description,
    //         websiteUrl: blogParam.websiteUrl,
    //     }});

    //     if (matchesResalt.matchedCount < 1) {
    //         throw new Error(API_ERRORS.id_not_exist);
    //     }
    // },

    async delete(id: string): Promise<void> {
        const deletedBlog = await usersCollection.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
