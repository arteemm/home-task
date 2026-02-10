import { Router, Request, Response } from 'express';
import { blogCollection, postsCollection } from '../../repositories/db';
import { HttpResponceCodes } from '../../core/constants/responseCodes';

export const testingRouter = Router({});

testingRouter.delete('/', async (
    req: Request<{}, {}, {}, {}>,
    res: Response,
  ) => {
    await Promise.all([
      blogCollection.deleteMany(),
      postsCollection.deleteMany()
    ])
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
  });