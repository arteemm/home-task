import { CreatePostDto } from '../../../src/posts/types/create-post-dto';

export function getPostDto (data?: Partial<CreatePostDto>): CreatePostDto {
    return {
        title: data?.title || 'title',
        shortDescription: data?.shortDescription || 'shortDescription',
        content: data?.content || 'content',
        blogId: data?.blogId || 'blogId',
    };
}

export function getPostDtoWithoutBlogId (data?: Partial<CreatePostDto>): Omit<CreatePostDto, 'blogId'> {
    return {
        title: data?.title || 'title',
        shortDescription: data?.shortDescription || 'shortDescription',
        content: data?.content || 'content',
    };
}