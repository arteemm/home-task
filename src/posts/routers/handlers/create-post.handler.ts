import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post, CreatePost } from '../../types/posts'


export function createPostsHandler(req: Request<{}, {}, CreatePost, {}>, res: Response) {
    const blogName = db.blogs.find(blog => blog.id === req.body.blogId)?.name;

    if (blogName) {
        const newPost: Post = {
        id : `${+new Date()}`,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName
        }
        db.posts.push(newPost);   
    }

     
    return res.status(HttpResponceCodes.CREATED_201).send(db.posts[db.posts.length - 1]);
};
