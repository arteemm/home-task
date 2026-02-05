import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsRepository } from '../../repositories/blogs.repository';


export function deleteBlogHandler(req: Request, res: Response) {
    const id = req.params.id.toString();
    blogsRepository.delete(id);
  
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
};
