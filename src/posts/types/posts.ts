export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

export type Post = Omit<PostViewModel, 'id'>;

export type CreatePost = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type ChangePost = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

