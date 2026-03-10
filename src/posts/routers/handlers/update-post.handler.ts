import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsService } from '../../domain/posts-service';
import { UpdatePostDto } from '../../types/update-post-dto';


export async function updatePostHandler(req: Request<{id: string}, {}, UpdatePostDto, {}>, res: Response) {
    try {
        const id = req.params.id.toString();

        await postsService.update(id, req.body);
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    }  catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
