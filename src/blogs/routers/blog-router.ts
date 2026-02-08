import express, { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogByIdHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { createBlogValidation } from './validation/create-blog-validation';
import { updateBlogValidation } from './validation/update-blog-validation';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';


export const blogsRouter: express.Router = Router({});

blogsRouter.get( "/", getBlogListHandler );

blogsRouter.get( "/:id",
  getBlogByIdHandler
);

blogsRouter.post( "/",
  checkAuthorizationMiddlewares,
  createBlogValidation,
  createBlogHandler
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
