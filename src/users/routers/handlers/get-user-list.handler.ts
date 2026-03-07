import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { usersQueryRepository } from '../../repositories/user.query.repository';

export async function getUserListHandler(req: Request, res: Response) {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } = await usersQueryRepository.findAll(queryInput);

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
