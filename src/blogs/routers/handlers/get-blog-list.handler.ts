import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsRepository } from '../../repositories/blogs.repository';


export function getBlogListHandler(req: Request, res: Response) {
    const blogs = blogsRepository.findAll();

    res.status(HttpResponceCodes.OK_200).send(blogs)
};
