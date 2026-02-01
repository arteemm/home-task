import express, { Router } from 'express';
import { checkId } from '../middlewares/checkIdMiddleware';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostByIdHandler } from './handlers/get-post.handler';
import { createPostsHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { createPostsValidation } from './validation/create-post-validation';
import { updatePostValidation } from './validation/update-post-validation';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';


export const postsRouter: express.Router = Router({});

postsRouter.get( "/", getPostListHandler );

postsRouter.get( "/:id",
  checkId,
  getPostByIdHandler
);

postsRouter.post( "/",
  checkAuthorizationMiddlewares,
  createPostsValidation,
  createPostsHandler
);
 
postsRouter.put("/:id",
  checkAuthorizationMiddlewares,
  checkId,
  updatePostValidation,
  updatePostHandler
);

postsRouter.delete("/:id",
  checkAuthorizationMiddlewares,
  checkId, 
  deletePostHandler
);


