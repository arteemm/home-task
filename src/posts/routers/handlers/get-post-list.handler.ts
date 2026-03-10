import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsQueryRepository } from '../../repositories/post.query.repository';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';


export async function getPostListHandler(req: Request, res: Response) {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await postsQueryRepository.findAll(queryInput);

    const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
    const postsViewModel = {
        pagesCount: pagesCount,
        page: +queryInput.pageNumber,
        pageSize: +queryInput.pageSize,
        totalCount: totalCount,
        items,
    };

    res.status(HttpResponceCodes.OK_200).send(postsViewModel);
};
