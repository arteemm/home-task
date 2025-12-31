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

  app.get("/videos/:id", (
    req: Request<{ id: string }, Video, {}, {}>,
    res: Response<Video | null>,
  ) => {
    const id = req.params.id;
    const videoById = db.videos.find((k) => k.id === +id)

    if (!videoById) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(videoById);
  });

  return app;
};