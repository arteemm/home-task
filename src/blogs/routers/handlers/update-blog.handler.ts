import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsService } from '../../domain/blogs-service';
import { UpdateBlogDto } from '../../types/update-blog-dto';


export async function updateBlogHandler(req: Request<{id: string}, {}, UpdateBlogDto>, res: Response) {
    try {
        const id = req.params.id.toString();

        await blogsService.update(id, req.body);
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    }  catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
