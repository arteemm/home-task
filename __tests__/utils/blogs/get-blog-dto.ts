import { CreateBlog } from '../../../src/blogs/types/blogs';

export function getBlogDto (data?: Partial<CreateBlog>): CreateBlog {
    return {
        name: data?.name || 'name',
        description: data?.description || 'description',
        websiteUrl: data?.websiteUrl || 'https://google1mail.ru'
    };
}