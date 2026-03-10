import { PostDBType } from '../types/postDBtype';
import { PostQueryInput } from '../types/post-query-input';
import { PostViewModel } from '../types/post-view-model';
import { postsCollection } from '../../repositories/db';
import { WithId, ObjectId } from 'mongodb';


export const postsQueryRepository = {
    async findAll(queryDto: PostQueryInput, blogId?: string): Promise<{ items: PostViewModel[]; totalCount: number }> {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = queryDto;
    
            const skip = (+pageNumber - 1) * +pageSize;
            const filter = blogId ? { blogId: blogId } : {};
    
            const items = await postsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(+pageSize)
                .toArray(); 

            const totalCount = await postsCollection.countDocuments(filter);
            return { items: this._mapToListPostsViewModel(items), totalCount};
        },

   async findById(id: string): Promise<PostViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const postDB = await postsCollection.findOne({_id: new ObjectId(id)})

        return postDB ? this._mapToPostViewModel(postDB) : null;
    },

    _mapToPostViewModel(data: WithId<PostDBType>): PostViewModel {
        return {
            id: data._id.toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName,
            createdAt: data.createdAt,
        }
    },

    _mapToListPostsViewModel(data: WithId<PostDBType>[]): PostViewModel[] {
        return data.map((item: WithId<PostDBType>) => {
            return {
                id: item._id.toString(),
                title: item.title,
                shortDescription: item.shortDescription,
                content: item.content,
                blogId: item.blogId,
                blogName: item.blogName,
                createdAt: item.createdAt,
            };
        });
    },
};
