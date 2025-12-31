import express, { Express, Request, Response } from "express";
import { db } from './db/in-memory.db';
import { Video } from './videos/types/video';
 
export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  // основной роут
  app.get("/videos", (
    req: Request,
    res: Response<Video[] | null>,
  ) => {
    res.status(200).send(db.videos);
  });
  return app;
};