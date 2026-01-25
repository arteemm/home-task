import express, { Application } from "express";
import { videosRouter } from './routes/videos-router';
import { testingRouter } from './routes/testing-router';
 
export const setupApp = (app: Application ) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  app.use('/videos', videosRouter)
  app.use('/testing', testingRouter)

  return app;
};