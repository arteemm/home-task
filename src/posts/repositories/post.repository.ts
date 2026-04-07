import { PostDocument, PostModel } from '../infrastructure/mongoose/post.shema';
import { UpdatePostDto } from '../types/update-post-dto';
import { IPostDB } from '../types/postDBinterface';
import { ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';


@injectable()
export class PostsRepository {
    constructor() {}

    async findById(id: string):  Promise<PostDocument | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return PostModel.findOne({_id: new ObjectId(id)});
    }

    async create(post: PostDocument):  Promise<string> {
        const insertResalt = await post.save(); 
        
        return insertResalt._id.toString();
    }

    async update(id: string, postParam: UpdatePostDto): Promise<void> {
        const matchesResalt = await PostModel.updateOne({_id: new ObjectId(id)}, {$set: {
            title: postParam.title,
            shortDescription: postParam.shortDescription,
            content: postParam.content,
            blogId: postParam.blogId,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async delete(id: string): Promise<void> {
        const deletedBlog = await PostModel.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
