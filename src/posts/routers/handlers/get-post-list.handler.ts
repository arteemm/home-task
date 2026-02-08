import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { postsRepository } from '../../repositories/post.repository';
import { mapToPostListViewModel } from '../mappers/map-to-post-list-view-model.util';


export async function getPostListHandler(req: Request, res: Response) {
    const posts = await postsRepository.findAll();
    const postViewModel = mapToPostListViewModel(posts);

    res.status(HttpResponceCodes.OK_200).send(postViewModel);
};
