import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsService } from '../../domain/blogs-service';
import { postsService } from '../../../posts/domain/posts-service';
import { mapToPostListViewModel } from '../../../posts/routers/mappers/map-to-post-list-view-model.util';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { PostQueryInput } from '../../../posts/types/posts'
import { Blog } from '../../types/blogs';
import { WithId } from 'mongodb';


export async function getPostsListInBlogHandler(req: Request<{id: string}, {}, {}, PostQueryInput>, res: Response) {
    const blogId = req.params.id.toString();
    const blog: WithId<Blog> | null = await blogsService.findById(blogId);

    if (!blog) {
        res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        return;
    }

    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const { items, totalCount } = await postsService.findAll(queryInput, blogId);

    const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
    const blogViewModel = mapToPostListViewModel({
        pagesCount: pagesCount,
        page: +queryInput.pageNumber,
        pageSize: +queryInput.pageSize,
        totalCount: totalCount
        },
        items,
    );

    res.status(HttpResponceCodes.OK_200).send(blogViewModel);
};
