import { PostDBType } from '../types/postDBtype';
import { UpdatePostDto } from '../types/update-post-dto';
import { postsCollection } from '../../repositories/db';
import { ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';


export const postsRepository = {
    async findById(id: string):  Promise<PostDBType | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return postsCollection.findOne({_id: new ObjectId(id)});
    },

    async create(newEntity: PostDBType):  Promise<string> {
        const insertResalt = await postsCollection.insertOne(newEntity); 
        
        return insertResalt.insertedId.toString();
    },

    async update(id: string, postParam: UpdatePostDto): Promise<void> {
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
