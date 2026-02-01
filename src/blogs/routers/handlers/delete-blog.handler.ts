import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Blog } from '../../types/blogs'


export function deleteBlogHandler(req: Request, res: Response) {
    const id = req.params.id;
    const indexInDb = db.blogs.findIndex((k: Blog) => k.id === id);
    db.blogs.splice(indexInDb, 1);
  
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
};
