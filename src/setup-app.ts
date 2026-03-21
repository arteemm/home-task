import express, { Express } from "express";
import { blogsRouter } from './blogs/routers/blog-router';
import { postsRouter } from './posts/routers/post-router';
import { testingRouter } from './testing/routes/testing-router';
import { usersRouter } from './users/routers/user-router';
import { authRouter } from './auth/routers/auth-router';
import { commentsRouter } from './comments/routers/comment-router';
import { POSTS_PATH, BLOGS_PATH, TESTING_PATH, USER_PATH, AUTH_PATH, COMMENTS_PATH } from './core/constants/paths';
import cookieParser from 'cookie-parser'

 

export const setupApp = (app: Express) => {

  app.use(express.json()); // middleware для парсинга JSON в теле запроса
  app.use(cookieParser()); // middleware для парсинга JSON в теле запроса
 
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USER_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENTS_PATH, commentsRouter);

  return app;
};