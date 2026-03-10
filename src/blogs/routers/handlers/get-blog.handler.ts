import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsQueryRepository } from '../../repositories/blogs.query.repositories';


export async function getBlogByIdHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();

        const blogViewModel = await blogsQueryRepository.findById(id);
        res.status(HttpResponceCodes.OK_200).send(blogViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
