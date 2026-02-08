import { Request, Response } from 'express';
import { db } from '../../../repositories/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post } from '../../types/posts';
import { postsRepository } from '../../repositories/post.repository';
import { WithId } from 'mongodb';


export async function deletePostHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        const post: WithId<Post> | null = await postsRepository.findById(id);

        if (!post) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        await postsRepository.delete(id);
    
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
