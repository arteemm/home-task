import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model.util';


export async function getBlogListHandler(req: Request, res: Response) {
    const blogs = await blogsRepository.findAll();
    const blogViewModel = mapToBlogListViewModel(blogs);

    res.status(HttpResponceCodes.OK_200).send(blogViewModel);
};
