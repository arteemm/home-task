export type Post = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};

export type CreatePost = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type ChangePost = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

