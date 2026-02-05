import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post } from '../../types/posts';
import { postsRepository } from '../../repositories/post.repository';


export function deletePostHandler(req: Request, res: Response) {
    const id = req.params.id.toString();
    postsRepository.delete(id);
  
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
};
