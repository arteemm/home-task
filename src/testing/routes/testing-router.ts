import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpResponceCodes } from '../../core/constants/responseCodes';

export const testingRouter = Router({});

testingRouter.delete('/', (
    req: Request<{}, {}, {}, {}>,
    res: Response,
  ) => {
    db.blogs.length = 0;
    db.posts.length = 0;
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
  });