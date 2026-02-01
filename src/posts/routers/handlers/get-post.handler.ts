import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { Post } from '../../types/posts'


export function getPostByIdHandler(req: Request, res: Response) {
    const id = req.params.id;
    const postById = db.posts.find((k: Post) => k.id === id);

    res.status(HttpResponceCodes.OK_200).send(postById);
};
