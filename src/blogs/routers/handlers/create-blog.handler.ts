import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Blog } from '../../types/blogs'


export function createBlogHandler(req: Request, res: Response) {
    const newBlog: Blog = {
        id : `${+new Date()}`,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        }

    db.blogs.push(newBlog);    
    return res.status(HttpResponceCodes.CREATED_201).send(db.blogs[db.blogs.length - 1]);
};
