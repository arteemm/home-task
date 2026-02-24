import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post } from '../../../posts/types/posts';
import { Blog } from '../../types/blogs';
import { blogsService } from '../../domain/blogs-service';
import { postsService } from '../../../posts/domain/posts-service';
import { WithId } from 'mongodb';
import { mapToPostViewModel } from '../../../posts/routers/mappers/map-to-post-view-model.utils';


export async function createPostInBlogHandler(req: Request, res: Response) {
    const blogId = req.params.id.toString();
    const blog: WithId<Blog> | null = await blogsService.findById(blogId);

    if (!blog) {
        res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        return;
    }

    const newPost: WithId<Post>  = await postsService.create({
        ...req.body,
        blogId
    });
    
    const blogViewModel = mapToPostViewModel(newPost);
    return res.status(HttpResponceCodes.CREATED_201).send(blogViewModel);
};
