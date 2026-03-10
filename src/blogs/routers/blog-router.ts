import express, { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogByIdHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { getPostsListInBlogHandler } from './handlers/get-posts-list-in-blog';
import { createPostInBlogHandler } from './handlers/create-post-in-blog';
import { createBlogValidation, updateBlogValidation } from './body.input-dto.validation-middleware';
import { createPostInBlogValidation } from '../../posts/routers/body.input-dto.validation-middleware';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { BlogSortField } from './input/blog-sort-field';
import { PostSortField } from '../../posts/routers/input/post-sort-field';
import { checkExistBlogByIdMiddleware } from './middlewares/check-exist-blog-by-Id.middleware';


export const blogsRouter: express.Router = Router({});

blogsRouter.get( "/",
  paginationAndSortingValidation(BlogSortField),
  getBlogListHandler
);

blogsRouter.get( "/:id",
  checkExistBlogByIdMiddleware,
  getBlogByIdHandler
);

blogsRouter.get( "/:id/posts",
  paginationAndSortingValidation(PostSortField),
  checkExistBlogByIdMiddleware,
  getPostsListInBlogHandler
);

blogsRouter.post( "/",
  checkAuthorizationMiddlewares,
  createBlogValidation,
  createBlogHandler
);

blogsRouter.post( "/:id/posts",
  checkAuthorizationMiddlewares,
  createPostInBlogValidation,
  checkExistBlogByIdMiddleware,
  createPostInBlogHandler
);

blogsRouter.put("/:id",
  checkAuthorizationMiddlewares,
  updateBlogValidation,
  checkExistBlogByIdMiddleware,
  updateBlogHandler
);

blogsRouter.delete("/:id",
  checkAuthorizationMiddlewares,
  checkExistBlogByIdMiddleware,
  deleteBlogHandler
);
