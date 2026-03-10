import { CreateBlogDto } from '../../../src/blogs/types/create-blog-dto';


export function getBlogDto (data?: Partial<CreateBlogDto>): CreateBlogDto {
    return {
        name: data?.name || 'name',
        description: data?.description || 'description',
        websiteUrl: data?.websiteUrl || 'https://google1mail.ru'
    };
}