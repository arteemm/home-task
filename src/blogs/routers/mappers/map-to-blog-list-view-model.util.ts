import { WithId } from 'mongodb';
import { Blog, BlogViewModel } from '../../types/blogs';


export function mapToBlogListViewModel(blogList: WithId<Blog>[]): BlogViewModel[] {
    return (
        blogList.map((blog: WithId<Blog>) => {
            return ({
                id: blog._id.toString(),
                name : blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            });
        })
    );
};
