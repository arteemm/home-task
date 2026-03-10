import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { CreatePostDto } from '../../types/create-post-dto';
import { postsService } from '../../domain/posts-service';
import { postsQueryRepository } from '../../repositories/post.query.repository';


export async function createPostsHandler(req: Request<{}, {}, CreatePostDto, {}>, res: Response) {
    const responce = await postsService.create(req.body);
    const postViewModel = await postsQueryRepository.findById(responce);

    return res.status(HttpResponceCodes.CREATED_201).send(postViewModel);
};
