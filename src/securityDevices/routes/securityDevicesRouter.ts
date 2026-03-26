import express, { Router } from 'express';
import { refreshTokenAutorizationMiddleware } from '../../auth/middlewares/refresh-token-autorization-middleware';
import { getDevicesHandler } from './handlers/getDevicesHandles';
import { deleteAllSessionsExceptCurrentlyHandler } from './handlers/deleteAllSessionsExceptCurrentlyHandler';
import { deleteSessionByDeviceIdHandler } from './handlers/deleteSessionByDeviceIdHandler';


export const securityDevicesRouter: express.Router = Router({});

securityDevicesRouter.get(
  "/",
  refreshTokenAutorizationMiddleware,
  getDevicesHandler,
);

securityDevicesRouter.delete(
  "/",
  refreshTokenAutorizationMiddleware,
  deleteAllSessionsExceptCurrentlyHandler,
);

securityDevicesRouter.delete(
  "/:deviceId",
  refreshTokenAutorizationMiddleware,
  deleteSessionByDeviceIdHandler,
);