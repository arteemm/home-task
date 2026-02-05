import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsRepository } from '../../repositories/blogs.repository';


export function getBlogByIdHandler(req: Request, res: Response) {
    const id = req.params.id.toString();
    const blogById = blogsRepository.findById(id);

    res.status(HttpResponceCodes.OK_200).send(blogById);
};
