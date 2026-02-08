import express, { Express } from "express";
import { blogsRouter } from './blogs/routers/blog-router';
import { postsRouter } from './posts/routers/post-router';
import { testingRouter } from './testing/routes/testing-router';
import { POSTS_PATH, BLOGS_PATH, TESTING_PATH } from './core/constants/paths';
 

export const setupApp = (app: Express) => {

  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  app.use(BLOGS_PATH, blogsRouter)
  app.use(POSTS_PATH, postsRouter)
  app.use(TESTING_PATH, testingRouter)

  return app;
};