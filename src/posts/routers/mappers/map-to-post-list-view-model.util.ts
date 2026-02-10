import { WithId } from 'mongodb';
import { Post, PostViewModel } from '../../types/posts';


export function mapToPostListViewModel(postList: WithId<Post>[]): PostViewModel[] {
    return (
        postList.map((post: WithId<Post>) => {
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
    );
};
