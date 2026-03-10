import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsService } from '../../../posts/domain/posts-service';
import { postsQueryRepository } from '../../../posts/repositories/post.query.repository';


export async function createPostInBlogHandler(req: Request, res: Response) {
    const blogId = req.params.id.toString();

    const insertResult  = await postsService.create({
        ...req.body,
        blogId
    });
    
    const postViewModel = await postsQueryRepository.findById(insertResult);
    return res.status(HttpResponceCodes.CREATED_201).send(postViewModel);
};
