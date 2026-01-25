import { Request, Response, NextFunction  } from 'express';
import { Video } from '../types/video';
import { HttpResponceCodes } from '../../core/types/responseCodes';
import { db } from '../../db/in-memory.db';


export const checkId = (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id;
    const videoById = db.videos.find((k: Video) => k.id === +id);

    if (!videoById) {
        return res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
    }

   return next();
};


        

