import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post } from '../../types/posts'


export function updatePostHandler(req: Request, res: Response) {
    const id = req.params.id;
    const indexInDb = db.posts.findIndex((k: Post) => k.id === id);  
    db.posts[indexInDb] = { ...db.posts[indexInDb], ...req.body};

    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
};
