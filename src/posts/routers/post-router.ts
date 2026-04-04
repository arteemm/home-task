import express, { Router } from 'express';
import { createPostValidation, updatePostValidation } from './body.input-dto.validation-middleware';
import { createCommentValidation } from '../../comments/routers/body.input-dto.validation-middleware';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { accessTokenAutorizationMiddleware } from '../../auth/middlewares/access-token-autorization-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { PostSortField } from './input/post-sort-field';
import { CommentSortField } from '../../comments/routers/input/comment-sort-field';
import { checkExistPostByIdMiddleware } from './middlewares/check-exist-post-by-Id.middleware';
import { container } from '../../ioc/composition-root';
import { PostsController } from './posts-controller';


const postsController = container.resolve(PostsController);

export const postsRouter: express.Router = Router({});

postsRouter.get(
  "/",
  paginationAndSortingValidation(PostSortField),
  postsController.getPostListHandler.bind(postsController)
);

postsRouter.get(
  "/:id",
  checkExistPostByIdMiddleware,
  postsController.getPostByIdHandler.bind(postsController)
);

postsRouter.get(
  "/:id/comments",
  paginationAndSortingValidation(CommentSortField),
  checkExistPostByIdMiddleware,
  postsController.getCommentListHandler.bind(postsController)
);

postsRouter.post(
  "/",
  checkAuthorizationMiddlewares,
  createPostValidation,
  postsController.createPostsHandler.bind(postsController)
);

postsRouter.post(
  "/:id/comments",
  accessTokenAutorizationMiddleware,
  checkExistPostByIdMiddleware,
  createCommentValidation,
  postsController.createCommentInPostsHandler.bind(postsController)
);
 
postsRouter.put(
  "/:id",
  checkAuthorizationMiddlewares,
  checkExistPostByIdMiddleware,
  updatePostValidation,
  postsController.updatePostHandler.bind(postsController)
);

postsRouter.delete(
  "/:id",
  checkAuthorizationMiddlewares,
  checkExistPostByIdMiddleware,
  postsController.deletePostHandler.bind(postsController)
);


