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


export const blogsRouter: express.Router = Router({});

blogsRouter.get( "/",
  paginationAndSortingValidation(BlogSortField),
  getBlogListHandler
);

blogsRouter.get( "/:id",
  getBlogByIdHandler
);

blogsRouter.get( "/:id/posts",
  paginationAndSortingValidation(PostSortField),
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
  createPostInBlogHandler
);

blogsRouter.put("/:id",
  checkAuthorizationMiddlewares,
  updateBlogValidation,
  updateBlogHandler
);

blogsRouter.delete("/:id",
  checkAuthorizationMiddlewares,
  deleteBlogHandler
);
