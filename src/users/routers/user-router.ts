import express, { Router } from 'express';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { createUserValidation } from './body.input-dto.validation-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { UserSortField } from './input/user-sort-field';
import { container } from '../../ioc/composition-root';
import { UserController } from './user-controller';


const userController = container.resolve(UserController);

export const usersRouter: express.Router = Router({});

usersRouter.get(
    '/',
    checkAuthorizationMiddlewares,
    paginationAndSortingValidation(UserSortField),
    userController.getUserListHandler.bind(userController)
)

usersRouter.post(
    '/',
    checkAuthorizationMiddlewares,
    createUserValidation,
    userController.createUser.bind(userController)
);

usersRouter.delete(
    '/:id',
    checkAuthorizationMiddlewares,
    userController.deleteUser.bind(userController)
);