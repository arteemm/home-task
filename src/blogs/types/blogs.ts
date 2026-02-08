export type Blog = {
    name: string;
    description: string;
    websiteUrl: string;
};

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
};

export type CreateBlog = Omit<Blog, 'id'>;

export type ChangeBlog = Omit<Blog, 'id'>;