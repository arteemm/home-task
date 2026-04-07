import express, { Router } from 'express';
import { updateCommentValidation, likeStatusValidationErr } from './body.input-dto.validation-middleware';
import { accessTokenAutorizationMiddleware } from '../../auth/middlewares/access-token-autorization-middleware';
import { checkExistCommentByIdMiddleware } from './middlewares/check-exist-comment-by-Id.middleware';
import { checOwnerCommentMiddleware } from './middlewares/check-owner-comment-middleware';
import { CommentsController } from './comments-controller';
import { container } from '../../ioc/composition-root';
import { accessTokenAutorizationOptionalMiddleware } from './middlewares/access-token-autorization-optional-middleware';


const commentsController = container.resolve(CommentsController);

export const commentsRouter: express.Router = Router({});

commentsRouter.get(
  "/:id",
  accessTokenAutorizationOptionalMiddleware,
  commentsController.getCommentByIdHandler.bind(commentsController)
);

commentsRouter.put(
  "/:id",
  accessTokenAutorizationMiddleware,
  updateCommentValidation,
  checkExistCommentByIdMiddleware,
  checOwnerCommentMiddleware,
  commentsController.updateCommentHandler.bind(commentsController)
);

commentsRouter.put(
  "/:id/like-status",
  accessTokenAutorizationMiddleware,
  likeStatusValidationErr,
  checkExistCommentByIdMiddleware,
  commentsController.updateLikeStatus.bind(commentsController)
);

commentsRouter.delete(
  "/:id",
  accessTokenAutorizationMiddleware,
  checkExistCommentByIdMiddleware,
  checOwnerCommentMiddleware,
  commentsController.deleteCommentHandler.bind(commentsController)
);
