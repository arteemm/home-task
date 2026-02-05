import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsRepository } from '../../repositories/post.repository';


export function updatePostHandler(req: Request, res: Response) {
    const id = req.params.id.toString();
    postsRepository.update(id, req.body);

    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
};
