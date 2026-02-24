import { SortDirection } from '../../core/types/sort-direction';

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

export type BlogListViewModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewModel[];
};

export type Blog = Omit<BlogViewModel, 'id'>;

export type CreateBlog = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type ChangeBlog = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type BlogQueryInput = {
    searchNameTerm: string | null;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: SortDirection;
};
