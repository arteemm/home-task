import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsRepository } from '../../repositories/post.repository';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.utils';


export async function getPostByIdHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        const postById = await postsRepository.findById(id);

        if (postById === null) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        const postViewModel = mapToPostViewModel(postById)
        res.status(HttpResponceCodes.OK_200).send(postViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
