import express, { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostByIdHandler } from './handlers/get-post.handler';
import { getCommentListHandler } from './handlers/get-comments-list-in-post';
import { createPostsHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { createCommentInPostsHandler } from './handlers/create-comment-in-post';
import { createPostValidation, updatePostValidation } from './body.input-dto.validation-middleware';
import { createCommentValidation } from '../../comments/routers/body.input-dto.validation-middleware';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { accessTokenAutorizationMiddleware } from '../../auth/middlewares/access-token-autorization-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { PostSortField } from './input/post-sort-field';
import { CommentSortField } from '../../comments/routers/input/comment-sort-field';
import { checkExistPostByIdMiddleware } from './middlewares/check-exist-post-by-Id.middleware';


export const postsRouter: express.Router = Router({});

postsRouter.get(
  "/",
  paginationAndSortingValidation(PostSortField),
  getPostListHandler
);

postsRouter.get(
  "/:id",
  checkExistPostByIdMiddleware,
  getPostByIdHandler
);

postsRouter.get(
  "/:id/comments",
  paginationAndSortingValidation(CommentSortField),
  checkExistPostByIdMiddleware,
  getCommentListHandler
);

postsRouter.post(
  "/",
  checkAuthorizationMiddlewares,
  createPostValidation,
  createPostsHandler
);

postsRouter.post(
  "/:id/comments",
  accessTokenAutorizationMiddleware,
  checkExistPostByIdMiddleware,
  createCommentValidation,
  createCommentInPostsHandler
);
 
postsRouter.put(
  "/:id",
  checkAuthorizationMiddlewares,
  checkExistPostByIdMiddleware,
  updatePostValidation,
  updatePostHandler
);

postsRouter.delete(
  "/:id",
  checkAuthorizationMiddlewares,
  checkExistPostByIdMiddleware,
  deletePostHandler
);


