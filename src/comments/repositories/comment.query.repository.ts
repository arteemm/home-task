import { CommentsDBType } from '../types/commentsDBtype';
import { CommentQueryInput } from '../../comments/types/comment-query-input';
import { CommentViewModel } from '../types//commentViewModel';
import { commentsCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';


export const commentsQueryRepository = {
    async findAll(queryDto: CommentQueryInput, postId: string): Promise<{ items: CommentViewModel[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (+pageNumber - 1) * +pageSize;
         const filter = { postId: postId};

        const items = await commentsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)
            .toArray(); 

        const totalCount = await commentsCollection.countDocuments(filter);
        return { items: this._mapToListCommentsViewModel(items), totalCount};
    },

   async findById(id: string): Promise<CommentViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const commentDB = await commentsCollection.findOne({_id: new ObjectId(id)});

        return commentDB ? this._mapToCommentViewModel(commentDB) : null;
    },

    _mapToCommentViewModel(data: WithId<CommentsDBType>): CommentViewModel {
        return {
            id: data._id.toString(),
            content: data.content,
            commentatorInfo: {
                userId: data.commentatorInfo.userId,
                userLogin: data.commentatorInfo.userLogin,
            },
            createdAt: data.createdAt,
        }
    },

    _mapToListCommentsViewModel(data: WithId<CommentsDBType>[]): CommentViewModel[] {
        return data.map((item: WithId<CommentsDBType>) => {
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
    },

    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
};
