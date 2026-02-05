import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsRepository } from '../../repositories/post.repository';


export function getPostByIdHandler(req: Request, res: Response) {
    const id = req.params.id.toString();
    const postById = postsRepository.findById(id);

    res.status(HttpResponceCodes.OK_200).send(postById);
};
