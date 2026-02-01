import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export function getPostListHandler(req: Request, res: Response) {
    res.status(HttpResponceCodes.OK_200).send(db.posts)
};
