import { IPostDB } from '../types/postDBinterface';
import { PostQueryInput } from '../types/post-query-input';
import { PostViewModel } from '../types/post-view-model';
import { WithId, ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import { PostModel } from '../infrastructure/mongoose/post.shema';


@injectable()
export class PostsQueryRepository {
    constructor() {}

    async findAll(queryDto: PostQueryInput, blogId?: string): Promise<{ items: PostViewModel[]; totalCount: number }> {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = queryDto;
    
            const skip = (+pageNumber - 1) * +pageSize;
            const filter = blogId ? { blogId: blogId } : {};
    
            const items = await PostModel
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(+pageSize)
                .lean(); 

            const totalCount = await PostModel.countDocuments(filter);
            return { items: this._mapToListPostsViewModel(items), totalCount};
    }

   async findById(id: string): Promise<PostViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const postDB = await PostModel.findOne({_id: new ObjectId(id)})

        return postDB ? this._mapToPostViewModel(postDB) : null;
    }

    _mapToPostViewModel(data: WithId<IPostDB>): PostViewModel {
        return {
            id: data._id.toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName,
            createdAt: data.createdAt,
        }
    }

    _mapToListPostsViewModel(data: WithId<IPostDB>[]): PostViewModel[] {
        return data.map((item: WithId<IPostDB>) => {
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
    }
};
