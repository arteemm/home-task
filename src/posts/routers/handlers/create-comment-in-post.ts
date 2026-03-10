import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsService } from '../../domain/posts-service';
import { commentsQueryRepository } from '../../../comments/repositories/comment.query.repository';


export async function createCommentInPostsHandler(req: Request<{ id: string }, {}, { content: string }, {}>, res: Response) {
    const userId = req.userId as string;
    const postId = req.params.id;

    const result = await postsService.creteCommentInPost(postId, userId, req.body.content);
    const comment = await commentsQueryRepository.findById(result);

    return res.status(HttpResponceCodes.CREATED_201).send(comment);
};
