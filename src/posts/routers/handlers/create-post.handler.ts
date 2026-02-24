import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { CreatePost } from '../../types/posts';
import { postsService } from '../../domain/posts-service';
import { WithId } from 'mongodb';
import { Post } from '../../types/posts';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.utils';


export async function createPostsHandler(req: Request<{}, {}, CreatePost, {}>, res: Response) {
    const newPost: WithId<Post> = await postsService.create(req.body);
    const postViewModel = mapToPostViewModel(newPost);

    return res.status(HttpResponceCodes.CREATED_201).send(postViewModel);
};
