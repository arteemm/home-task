import { CreatePost } from '../../../src/posts/types/posts';

export function getPostDto (data?: Partial<CreatePost>): CreatePost {
    return {
        title: data?.title || 'title',
        shortDescription: data?.shortDescription || 'shortDescription',
        content: data?.content || 'content',
        blogId: data?.blogId || 'blogId',
    };
}

export function getPostDtoWithoutBlogId (data?: Partial<CreatePost>): Omit<CreatePost, 'blogId'> {
    return {
        title: data?.title || 'title',
        shortDescription: data?.shortDescription || 'shortDescription',
        content: data?.content || 'content',
    };
}