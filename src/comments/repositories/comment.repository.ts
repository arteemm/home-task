import { commentsCollection } from '../../repositories/db';
import { ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { CommentsDBType } from '../types/commentsDBtype';


export const commentRepository = {
    async create(newEntity: CommentsDBType): Promise<string> {
        const insertResalt = await commentsCollection.insertOne(newEntity);

        return insertResalt.insertedId.toString();
    },

    async update(id: string, data: { content: string }): Promise<void> {
        const matchesResalt = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            content: data.content,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    },

    async delete(id: string): Promise<void> {
        const deletedBlog = await commentsCollection.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
