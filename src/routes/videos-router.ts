import { Router, Request, Response } from 'express';
import { db } from '../db/in-memory.db';
import { Video, CreateVideo, ChangeVideo } from '../videos/types/video';
import { HttpResponceCodes } from '../core/types/responseCodes';
import { checkPostBody } from '../videos/middlewares/postValidationMiddleware';
import { checkPutBody } from '../videos/middlewares/putValidationMiddleware';
import { checkId } from '../videos/middlewares/checkIdMiddleware';
import { errorsHandler } from '../videos/middlewares/errorsHandlerMiddleware';

export const videosRouter: Router = Router({});

videosRouter.get("/", (
    req: Request,
    res: Response<Video[] | null>,
) => {

    res.status(200).send(db.videos);
});

videosRouter.get("/:id", 
    checkId, (
    req: Request<{ id: string }, Video, {}, {}>,
    res: Response<Video | null>,
    ) => {
    const id = req.params.id;
    const videoById = db.videos.find((k: Video) => k.id === +id);

    res.status(HttpResponceCodes.OK_200).send(videoById);
});

videosRouter.post("/",
    checkPostBody,
    errorsHandler,
    async ( req: Request<CreateVideo>, res: Response<Video | null> ) => {

    const newVideo: Video = {
      id : + new Date(),
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: req.body.availableResolutions,
    }

    db.videos.push(newVideo);    
    return res.status(HttpResponceCodes.CREATED_201).send(db.videos[db.videos.length - 1]);
  });
 
  videosRouter.put("/:id",
    checkId,
    checkPostBody,
    checkPutBody,
    errorsHandler,
    (
    req: Request<{ id: string }, {}, ChangeVideo, {}>,
    res: Response,
  ) => {
    const id = req.params.id;
    const indexInDb = db.videos.findIndex((k: Video) => k.id === +id);  
    db.videos[indexInDb] = { ...db.videos[indexInDb], ...req.body};

    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
  });

  videosRouter.delete("/:id", 
    checkId, (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response,
  ) => {
    const id = req.params.id;
    const indexInDb = db.videos.findIndex((k: Video) => k.id === +id);
    db.videos.splice(indexInDb, 1);
  
    res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
  });


