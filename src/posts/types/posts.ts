import { SortDirection } from '../../core/types/sort-direction';

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

export type PostListViewModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModel[];
};

export type Post = Omit<PostViewModel, 'id'>;

export type CreatePost = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type ChangePost = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostQueryInput = {
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: SortDirection;
};
