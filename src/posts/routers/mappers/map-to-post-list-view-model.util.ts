import { WithId } from 'mongodb';
import { Post, PostListViewModel } from '../../types/posts';


export function mapToPostListViewModel(meta: { pagesCount: number; page: number; pageSize: number; totalCount: number; }, items: WithId<Post>[] ): PostListViewModel {
    return ({
        pagesCount: meta.pagesCount,
        page: meta.page,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: items.map((post: WithId<Post>) => {
            return ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            });
        })
    });
};
