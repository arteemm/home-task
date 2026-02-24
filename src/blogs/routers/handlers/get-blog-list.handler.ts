import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsService } from '../../domain/blogs-service';
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.util';
import { BlogQueryInput, BlogListViewModel } from '../../types/blogs';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getBlogListHandler(req: Request<{}, {}, {}, BlogQueryInput>, res: Response) {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await blogsService.findAll(queryInput);

    const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
    const blogViewModel = mapToBlogListViewModel({
        pagesCount: pagesCount,
        page: +queryInput.pageNumber,
        pageSize: +queryInput.pageSize,
        totalCount: totalCount
        },
        items,
    );

    res.status(HttpResponceCodes.OK_200).send(blogViewModel);
};
