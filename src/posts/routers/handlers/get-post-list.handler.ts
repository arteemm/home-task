import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsService } from '../../domain/posts-service';
import { mapToPostListViewModel } from '../mappers/map-to-post-list-view-model.util';


export async function getPostListHandler(req: Request, res: Response) {
    const posts = await postsService.findAll();
    const postViewModel = mapToPostListViewModel(posts);

    res.status(HttpResponceCodes.OK_200).send(postViewModel);
};
