import { Blog, CreateBlog, ChangeBlog } from '../types/blogs';
import { blogCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';


export const blogsRepository = {
    async findAll(): Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },

    async findById(id: string): Promise<WithId<Blog> | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return blogCollection.findOne({_id: new ObjectId(id)});
    },

    async create(newEntity: Blog): Promise<{_id: ObjectId}> {
        const insertResalt = await blogCollection.insertOne(newEntity);

        return { _id: insertResalt.insertedId };
    },

    async update(id: string, blogParam: ChangeBlog): Promise<void> {
        const matchesResalt = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            name: blogParam.name,
            description: blogParam.description,
            websiteUrl: blogParam.websiteUrl,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    },

    async delete(id: string): Promise<void> {
        const deletedBlog = await blogCollection.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
