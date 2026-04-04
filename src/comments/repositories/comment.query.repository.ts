import { ICommentDB } from '../types/commentsDBInterface';
import { CommentDocument, CommentModel } from '../infrastructure/mongoose/comment.shema';
import { CommentQueryInput } from '../../comments/types/comment-query-input';
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

    _mapToCommentViewModel(data: WithId<ICommentDB>): CommentViewModel {
        return {
            id: data._id.toString(),
            content: data.content,
            commentatorInfo: {
                userId: data.commentatorInfo.userId,
                userLogin: data.commentatorInfo.userLogin,
            },
            createdAt: data.createdAt,
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
            };
        });
    }

    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
};
