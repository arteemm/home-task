import { ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { CommentDocument, CommentModel } from '../infrastructure/mongoose/comment.shema';
import { injectable } from 'inversify';


@injectable()
export class CommentRepository {
    constructor() {}

    async create(newEntity: CommentDocument): Promise<string> {
        const insertResalt = await newEntity.save();

        return insertResalt._id.toString();
    }

    async update(id: string, data: { content: string }): Promise<void> {
        const matchesResalt = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {
            content: data.content,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async delete(id: string): Promise<void> {
        const deletedBlog = await CommentModel.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
