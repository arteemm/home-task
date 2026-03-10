import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsService } from '../../domain/blogs-service';


export async function deleteBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();

        await blogsService.delete(id);
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
