export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

export type Blog = Omit<BlogViewModel, 'id'>;

export type CreateBlog = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type ChangeBlog = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;