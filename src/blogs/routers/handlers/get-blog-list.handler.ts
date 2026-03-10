import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { BlogQueryInput } from '../../types/blog-query-input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { blogsQueryRepository } from '../../repositories/blogs.query.repositories';


export async function getBlogListHandler(req: Request<{}, {}, {}, BlogQueryInput>, res: Response) {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await blogsQueryRepository.findAll(queryInput);

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
