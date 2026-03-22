import express, { Router } from 'express';
import { refreshTokenAutorizationMiddleware } from '../../auth/middlewares/refresh-token-autorization-middleware';
import { getDevicesHandler } from './handlers/getDevicesHandles';


export const securityDevicesRouter: express.Router = Router({});

securityDevicesRouter.get(
  "/",
  refreshTokenAutorizationMiddleware,
  getDevicesHandler,
);