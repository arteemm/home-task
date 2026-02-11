import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post } from '../../types/posts';
import { postsService } from '../../domain/posts-service';
import { WithId } from 'mongodb';


export async function deletePostHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        const post: WithId<Post> | null = await postsService.findById(id);

        if (!post) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        await postsService.delete(id);
    
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
