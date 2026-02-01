import { Request, Response, NextFunction  } from 'express';
import { Blog } from '../types/blogs';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { db } from '../../db/in-memory.db';


export const checkId = (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id;
    const videoById = db.blogs.find((k: Blog) => k.id === id);

    if (!videoById) {
        return res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
    }

   return next();
};


        

