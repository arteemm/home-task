import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsQueryRepository } from '../../repositories/post.query.repository';


export async function getPostByIdHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();

        const postViewModel = await postsQueryRepository.findById(id)
        res.status(HttpResponceCodes.OK_200).send(postViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
