import { WithId } from 'mongodb';
import { Blog, BlogViewModel } from '../../types/blogs';


export function mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
    return ({
            id: blog._id.toString(),
            name : blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        });
};
