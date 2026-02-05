import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { CreatePost } from '../../types/posts';
import { postsRepository } from '../../repositories/post.repository';


export function createPostsHandler(req: Request<{}, {}, CreatePost, {}>, res: Response) {
    const newPost = postsRepository.create(req.body);
    
    return res.status(HttpResponceCodes.CREATED_201).send(newPost);
};
