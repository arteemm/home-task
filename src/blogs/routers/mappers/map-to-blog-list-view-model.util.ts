import { WithId } from 'mongodb';
import { Blog, BlogListViewModel } from '../../types/blogs';


export function mapToBlogListViewModel(meta: { pagesCount: number; page: number; pageSize: number; totalCount: number; }, items: WithId<Blog>[] ): BlogListViewModel {
    return ({
        pagesCount: meta.pagesCount,
        page: meta.page,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: items.map((blog: WithId<Blog>) => {
            return ({
                id: blog._id.toString(),
                name : blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            });
        })
    });
};
