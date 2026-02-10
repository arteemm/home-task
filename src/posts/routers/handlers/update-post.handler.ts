import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsRepository } from '../../repositories/post.repository';
import { WithId } from 'mongodb';
import { Post } from '../../types/posts';


export async function updatePostHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        const post: WithId<Post> | null = await postsRepository.findById(id);

        if (!post) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        await postsRepository.update(id, req.body);
        res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    }  catch(err: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
