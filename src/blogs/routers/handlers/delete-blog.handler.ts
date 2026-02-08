import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsRepository } from '../../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { Blog } from '../../types/blogs';


export async function deleteBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        const blog: WithId<Blog> | null = await blogsRepository.findById(id);

        if (!blog) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        await blogsRepository.delete(id);
    
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
