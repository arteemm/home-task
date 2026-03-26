import express, { Express } from "express";
import { blogsRouter } from './blogs/routers/blog-router';
import { postsRouter } from './posts/routers/post-router';
import { testingRouter } from './testing/routes/testing-router';
import { usersRouter } from './users/routers/user-router';
import { authRouter } from './auth/routers/auth-router';
import { commentsRouter } from './comments/routers/comment-router';
import { POSTS_PATH, BLOGS_PATH, TESTING_PATH, USER_PATH, AUTH_PATH, COMMENTS_PATH, SECURITY_DEVICES_PATH } from './core/constants/paths';
import cookieParser from 'cookie-parser';
import { securityDevicesRouter } from './securityDevices/routes/securityDevicesRouter';
 

export const setupApp = (app: Express) => {

  app.set('trust proxy', true);

  app.use(express.json()); // middleware для парсинга JSON в теле запроса
  app.use(cookieParser()); // middleware для парсинга Cookies в теле запроса
 
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USER_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENTS_PATH, commentsRouter);
  app.use(SECURITY_DEVICES_PATH, securityDevicesRouter);

  return app;
};