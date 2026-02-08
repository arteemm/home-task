import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Blog } from '../../types/blogs';
import { blogsRepository } from '../../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.utils';


export async function createBlogHandler(req: Request, res: Response) {
    const newBlog: WithId<Blog> = await blogsRepository.create(req.body);
    const blogViewModel = mapToBlogViewModel(newBlog);

    return res.status(HttpResponceCodes.CREATED_201).send(blogViewModel);
};
