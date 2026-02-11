import { Post, CreatePost, ChangePost } from '../types/posts';
import { postsCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';


export const postsRepository = {
    async findAll(): Promise<WithId<Post>[]> {
        return postsCollection.find().toArray();
    },

    async findById(id: string):  Promise<WithId<Post> | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return postsCollection.findOne({_id: new ObjectId(id)});
    },

    async create(newEntity: Post):  Promise<{_id: ObjectId}> {
        const insertResalt = await postsCollection.insertOne(newEntity); 
        
        return {_id: insertResalt.insertedId};
    },

    async update(id: string, postParam: ChangePost): Promise<void> {
        const matchesResalt = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            title: postParam.title,
            shortDescription: postParam.shortDescription,
            content: postParam.content,
            blogId: postParam.blogId,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    },

    async delete(id: string): Promise<void> {
        const deletedBlog = await postsCollection.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
