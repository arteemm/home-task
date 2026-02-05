import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsRepository } from '../../repositories/post.repository';


export function getPostListHandler(req: Request, res: Response) {
    const posts = postsRepository.findAll();
    res.status(HttpResponceCodes.OK_200).send(posts)
};
