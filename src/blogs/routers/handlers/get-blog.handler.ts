import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Blog } from '../../types/blogs'


export function getBlogByIdHandler(req: Request, res: Response) {
    const id = req.params.id;
    const blogById = db.blogs.find((k: Blog) => k.id === id);

    res.status(HttpResponceCodes.OK_200).send(blogById);
};
