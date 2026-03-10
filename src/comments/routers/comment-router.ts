import express, { Router } from 'express';
import { getCommentByIdHandler } from './handlers/get-comment.handler';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { updateCommentValidation } from './body.input-dto.validation-middleware';
import { accessTokenAutorizationMiddleware } from '../../auth/middlewares/access-token-autorization-middleware';
import { checkExistCommentByIdMiddleware } from './middlewares/check-exist-comment-by-Id.middleware';
import { checOwnerCommentMiddleware } from './middlewares/check-owner-comment-middleware';


export const commentsRouter: express.Router = Router({});

commentsRouter.get(
  "/:id",
  getCommentByIdHandler
);

commentsRouter.put(
  "/:id",
  accessTokenAutorizationMiddleware,
  updateCommentValidation,
  checkExistCommentByIdMiddleware,
  checOwnerCommentMiddleware,
  updateCommentHandler
);

commentsRouter.delete(
  "/:id",
  accessTokenAutorizationMiddleware,
  checkExistCommentByIdMiddleware,
  checOwnerCommentMiddleware,
  deleteCommentHandler
);
