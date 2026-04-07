import express, { Router } from 'express';
import { createBlogValidation, updateBlogValidation } from './body.input-dto.validation-middleware';
import { createPostInBlogValidation } from '../../posts/routers/body.input-dto.validation-middleware';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { BlogSortField } from './input/blog-sort-field';
import { PostSortField } from '../../posts/routers/input/post-sort-field';
import { checkExistBlogByIdMiddleware } from './middlewares/check-exist-blog-by-Id.middleware';
import { container } from '../../ioc/composition-root';
import { BlogController } from './blog-controller';


const blogController = container.resolve(BlogController);

export const blogsRouter: express.Router = Router({});

blogsRouter.get( "/",
  paginationAndSortingValidation(BlogSortField),
  blogController.getBlogListHandler.bind(blogController)
);

blogsRouter.get( "/:id",
  checkExistBlogByIdMiddleware,
  blogController.getBlogByIdHandler.bind(blogController)
);

blogsRouter.get( "/:id/posts",
  paginationAndSortingValidation(PostSortField),
  checkExistBlogByIdMiddleware,
  blogController.getPostsListInBlogHandler.bind(blogController)
);

blogsRouter.post( "/",
  checkAuthorizationMiddlewares,
  createBlogValidation,
  blogController.createBlogHandler.bind(blogController)
);

blogsRouter.post( "/:id/posts",
  checkAuthorizationMiddlewares,
  createPostInBlogValidation,
  checkExistBlogByIdMiddleware,
  blogController.createPostInBlogHandler.bind(blogController)
);

blogsRouter.put("/:id",
  checkAuthorizationMiddlewares,
  updateBlogValidation,
  checkExistBlogByIdMiddleware,
  blogController.updateBlogHandler.bind(blogController)
);

blogsRouter.delete("/:id",
  checkAuthorizationMiddlewares,
  checkExistBlogByIdMiddleware,
  blogController.deleteBlogHandler.bind(blogController)
);
