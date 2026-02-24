import express, { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostByIdHandler } from './handlers/get-post.handler';
import { createPostsHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { createPostValidation, updatePostValidation } from './body.input-dto.validation-middleware';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { PostSortField } from './input/post-sort-field';


export const postsRouter: express.Router = Router({});

postsRouter.get( "/",
  paginationAndSortingValidation(PostSortField),
  getPostListHandler );

postsRouter.get( "/:id",
  getPostByIdHandler
);

postsRouter.post( "/",
  checkAuthorizationMiddlewares,
  createPostValidation,
  createPostsHandler
);
 
postsRouter.put("/:id",
  checkAuthorizationMiddlewares,
  updatePostValidation,
  updatePostHandler
);

postsRouter.delete("/:id",
  checkAuthorizationMiddlewares,
  deletePostHandler
);


