import { Router, Request, Response } from 'express';
import { db } from '../db/in-memory.db';
import { HttpResponceCodes } from '../core/types/responseCodes';

export const testingRouter = Router({});

testingRouter.delete('/all-data', (
    req: Request<{}, {}, {}, {}>,
    res: Response,
  ) => {
    db.videos.length = 0;
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
  });