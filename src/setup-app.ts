import express, { Express } from "express";
import { videosRouter } from './routes/videos-router';
import { testingRouter } from './routes/testing-router';
 
export const setupApp = (): express.Application => {
  const app = express();

  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  app.use('/videos', videosRouter)
  app.use('/testing', testingRouter)

  return app;
};