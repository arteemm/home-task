import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Blog } from '../../types/blogs';
import { blogsRepository } from '../../repositories/blogs.repository';


export function createBlogHandler(req: Request, res: Response) {
    const newBlog: Blog = blogsRepository.create(req.body);
    return res.status(HttpResponceCodes.CREATED_201).send(newBlog);
};
