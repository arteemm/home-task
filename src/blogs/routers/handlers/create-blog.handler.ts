import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsService } from '../../domain/blogs-service';
import { CreateBlogDto } from '../../types/create-blog-dto';
import { blogsQueryRepository } from '../../repositories/blogs.query.repositories';
import { BlogViewModel } from '../../types/blog-view-model';


export async function createBlogHandler(req: Request<{}, {}, CreateBlogDto>, res: Response<BlogViewModel>) {
    try {
        const result = await blogsService.create(req.body);
        const blogViewModel = await blogsQueryRepository.findById(result) as BlogViewModel;

        return res.status(HttpResponceCodes.CREATED_201).send(blogViewModel);
    } catch(e: unknown) {
        console.error(e);
        return;
    }
};
