import { Router, Request, Response } from 'express';
import { RateLimitModel } from '../../auth/domain/rate.limit.entity';
import { BlogModel } from '../../blogs/domain/blog.entity';
import { CommentModel } from '../../comments/domain/comment.entity';
import { PostModel } from '../../posts/domain/post.entity';
import { SecurityDevicesModel } from '../../securityDevices/domain/security.devices.entity';
import { UserModel } from '../../users/domain/user.entity';
import { LikeOfCommentModel } from '../../comments/domain/like-of-comment.entity';
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