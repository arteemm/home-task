import { PostDocument, PostModel } from '../domain/post.entity';
import { LikeOfPostDocument, LikeOfPostModel } from '../domain/like-of-post.entiy';
import { ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { injectable } from 'inversify';
import { StdioNull } from 'node:child_process';


@injectable()
export class PostsRepository {
    constructor() {}

    async findById(id: string):  Promise<PostDocument | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return PostModel.findById(id);
    }

    async findLikeOfPostByPostId(postId: string): Promise<LikeOfPostDocument | null> {
        return LikeOfPostModel.findOne({postId: postId});
    }

    async create(post: PostDocument):  Promise<string> {
        const insertResalt = await post.save(); 
        
        return insertResalt._id.toString();
    }

    async saveLike(likeOfPost: LikeOfPostDocument) {
        try {

            await likeOfPost.save();
        } catch(e) {
            console.error
        }
        
    }

    async savePost(post: PostDocument): Promise<void> {
        await post.save()
    }

    async delete(id: string): Promise<void> {
        const deletedBlog = await PostModel.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
