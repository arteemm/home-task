import express, { Router } from 'express';
import { refreshTokenAutorizationMiddleware } from '../../auth/middlewares/refresh-token-autorization-middleware';
import { container } from '../../ioc/composition-root';
import { SecurityDevicesController } from './security-devices-controller';


const securityDevicesController = container.resolve(SecurityDevicesController);

export const securityDevicesRouter: express.Router = Router({});

securityDevicesRouter.get(
  "/",
  refreshTokenAutorizationMiddleware,
  securityDevicesController.getDevicesHandler.bind(securityDevicesController)
);

securityDevicesRouter.delete(
  "/",
  refreshTokenAutorizationMiddleware,
  securityDevicesController.deleteAllSessionsExceptCurrentlyHandler.bind(securityDevicesController)
);

securityDevicesRouter.delete(
  "/:deviceId",
  refreshTokenAutorizationMiddleware,
  securityDevicesController.deleteSessionByDeviceIdHandler.bind(securityDevicesController)
);