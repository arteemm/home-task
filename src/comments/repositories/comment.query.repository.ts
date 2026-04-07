import { ICommentDB } from '../types/commentsDBInterface';
import { CommentDocument, CommentModel } from '../infrastructure/mongoose/comment.shema';
import { LikeOfCommentModel, LikeInfoSchemaDocument } from '../infrastructure/mongoose/like-of-comment.schema';
import { CommentQueryInput } from '../../comments/types/comment-query-input';
import { ILikeOfCommentDB } from '../../comments/types/likeOfCommentInterface';
import { LikeofCommentInfo } from '../../comments/domain/like-of-comment.entity';
import { CommentViewModel } from '../types/commentViewModel';
import { WithId, ObjectId } from 'mongodb';
import { injectable } from 'inversify';


@injectable()
export class CommentsQueryRepository {
    constructor() {}
    
    async findAll(queryDto: CommentQueryInput, postId: string): Promise<{ items: CommentViewModel[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (+pageNumber - 1) * +pageSize;
         const filter = { postId: postId};

        const items = await CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .lean(); 

        const totalCount = await CommentModel.countDocuments(filter);
        return { items: this._mapToListCommentsViewModel(items), totalCount};
    }

   async findById(id: string): Promise<CommentViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const commentDB = await CommentModel.findOne({_id: new ObjectId(id)});

        return commentDB ? this._mapToCommentViewModel(commentDB) : null;
    }

    async findLikeByCommentIdAndUserId(commentId: string, userId: string): Promise<LikeofCommentInfo | null>  {
        let responce: LikeofCommentInfo | undefined;
        try {
            const result = await LikeOfCommentModel.findOne({
                commentId: commentId,
                'likesListofComment.userId': userId,
            });

            if (!result) {
                return null;
            }

            responce = result.likesListofComment.find(item => item.userId === userId);

        } catch(e) {
            console.error(e);
        }

        if (!responce) {
            return null;
        }

        return responce;
    }

    async findLikesListByCommentId(commentId: string): Promise<LikeofCommentInfo[] | null>  {
        const result = await LikeOfCommentModel.findOne({ commentId: commentId });

        if (!result) {
            return null;
        }

        return result.likesListofComment;
    }

    async findLikesListByPostId(postId: string): Promise<ILikeOfCommentDB[] | null>  {
        const result = await LikeOfCommentModel.find({ 'likesListofComment.postId': postId }).lean();

        if (!result) {
            return null;
        }

        return result;
    }

    _mapToCommentViewModel(data: WithId<ICommentDB>): CommentViewModel {
        return {
            id: data._id.toString(),
            content: data.content,
            commentatorInfo: {
                userId: data.commentatorInfo.userId,
                userLogin: data.commentatorInfo.userLogin,
            },
            createdAt: data.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
            }
        }
    }

    _mapToListCommentsViewModel(data: WithId<ICommentDB>[]): CommentViewModel[] {
        return data.map((item: WithId<ICommentDB>) => {
            return {
                id: item._id.toString(),
                content: item.content,
                commentatorInfo: {
                    userId: item.commentatorInfo.userId,
                    userLogin: item.commentatorInfo.userLogin
                },
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                }
            };
        });
    }
};
