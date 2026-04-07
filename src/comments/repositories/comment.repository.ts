import { ObjectId } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { CommentDocument, CommentModel } from '../infrastructure/mongoose/comment.shema';
import { injectable } from 'inversify';
import { LikeStatusType } from '../types/like-status.dto';
import { LikeOfCommentModel, LikeOfCommentDocument } from '../infrastructure/mongoose/like-of-comment.schema';


@injectable()
export class CommentRepository {
    constructor() {}

    async create(newEntity: CommentDocument): Promise<string> {
        const insertResalt = await newEntity.save();

        return insertResalt._id.toString();
    }

     async createLike(like: LikeOfCommentDocument): Promise<void> {
        await like.save();
     }

    async update(id: string, data: { content: string }): Promise<void> {
        const matchesResalt = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {
            content: data.content,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async addLikeInfoByUserId(commentId: string, userId: string, likeStatus: LikeStatusType, postId: string): Promise<void> {
        try {
            const result = await LikeOfCommentModel.findOne({ commentId: commentId });
            result?.likesListofComment.push({
                likeStatus: likeStatus,
                postId: postId,
                userId: userId,
                createdAt: new Date().toISOString(),
            });
            await result!.save();
        } catch(e) {
            throw new Error('something wrong in addLikeInfoByUserId'); 
        }
    }

    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatusType): Promise<void> {
        try{
            const comment = await LikeOfCommentModel.findOne({ commentId: commentId });
            const index = comment?.likesListofComment.findIndex(item => item.userId === userId) as number;
            comment!.likesListofComment[index].likeStatus = likeStatus;
            await comment!.save();
        } catch(e) {
            throw new Error('something wrong in updateLikeStatus'); 
        }
    }

    async delete(id: string): Promise<void> {
        const deletedBlog = await CommentModel.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
