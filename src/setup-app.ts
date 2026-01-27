import express, { Express } from "express";
import { videosRouter } from './routes/videos-router';
import { testingRouter } from './routes/testing-router';
import { VIDEOS_PATH, TESTING_PATH } from './core/constants/paths'
 
export const setupApp = (app: Express) => {

  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  app.use(VIDEOS_PATH, videosRouter)
  app.use(TESTING_PATH, testingRouter)

  return app;
};