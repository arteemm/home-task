import { Request, Response, NextFunction  } from 'express';
import { Post } from '../types/posts';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { db } from '../../db/in-memory.db';


export const checkId = (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id;
    const videoById = db.posts.find((k: Post) => k.id === id);

    if (!videoById) {
        return res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
    }

   return next();
};


        

