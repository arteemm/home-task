import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsRepository } from '../../repositories/blogs.repository';


export function updateBlogHandler(req: Request, res: Response) {
    const id = req.params.id.toString();
    blogsRepository.update(id, req.body);

    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
};
