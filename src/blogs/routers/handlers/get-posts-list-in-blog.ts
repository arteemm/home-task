import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsQueryRepository } from '../../../posts/repositories/post.query.repository';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { PostQueryInput } from '../../../posts/types/post-query-input';


export async function getPostsListInBlogHandler(req: Request<{id: string}, {}, {}, PostQueryInput>, res: Response) {
    const blogId = req.params.id.toString();

    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const { items, totalCount } = await postsQueryRepository.findAll(queryInput, blogId);

    const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
    const blogViewModel = {
        pagesCount: pagesCount,
        page: +queryInput.pageNumber,
        pageSize: +queryInput.pageSize,
        totalCount: totalCount,
        items,
        };

    res.status(HttpResponceCodes.OK_200).send(blogViewModel);
};
