import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { commentsQueryRepository } from '../../../comments/repositories/comment.query.repository';

export async function getCommentListHandler(req: Request, res: Response) {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const postId = req.params.id.toString();

    const { items, totalCount } = await commentsQueryRepository.findAll(queryInput, postId);

    if (totalCount === 0) {
        res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
    }

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
