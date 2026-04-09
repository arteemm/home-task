import { Router, Request, Response } from 'express';
import { RateLimitModel } from '../../auth/infrastructure/mongoose/rate.limit.shema';
import { BlogModel } from '../../blogs/infrastructure/mongoose/blog.shema';
import { CommentModel } from '../../comments/infrastructure/mongoose/comment.shema';
import { PostModel } from '../../posts/infrastructure/mongoose/post.shema';
import { SecurityDevicesModel } from '../../securityDevices/infrastructure/mongoose/security.devices.shema';
import { UserModel } from '../../users/infrastructure/mongoose/user.shema';
import { LikeOfCommentModel } from '../../comments/infrastructure/mongoose/like-of-comment.schema';
import { HttpResponceCodes } from '../../core/constants/responseCodes';


export const testingRouter = Router({});

testingRouter.delete('/', async (
    req: Request<{}, {}, {}, {}>,
    res: Response,
  ) => {
    await Promise.all([
      RateLimitModel.deleteMany(),
      BlogModel.deleteMany(),
      CommentModel.deleteMany(),
      PostModel.deleteMany(), 
      SecurityDevicesModel.deleteMany(),
      UserModel.deleteMany(),
      LikeOfCommentModel.deleteMany(),
    ])
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
  });