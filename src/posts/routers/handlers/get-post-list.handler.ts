import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsService } from '../../domain/posts-service';
import { mapToPostListViewModel } from '../../../posts/routers/mappers/map-to-post-list-view-model.util';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { PostQueryInput } from '../../../posts/types/posts';


export async function getPostListHandler(req: Request<{}, {}, {}, PostQueryInput>, res: Response) {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await postsService.findAll(queryInput);

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
