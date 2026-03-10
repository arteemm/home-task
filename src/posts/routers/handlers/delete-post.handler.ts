import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsService } from '../../domain/posts-service';


export async function deletePostHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        await postsService.delete(id);
    
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
