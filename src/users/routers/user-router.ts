import express, { Router } from 'express';
import { createUser } from './handlers/create-user-handler';
import { getUserListHandler } from './handlers/get-user-list.handler';
import { deleteUser } from './handlers/delete-user-handler';
import { checkAuthorizationMiddlewares } from '../../auth/middlewares/check-authorization-middleware';
import { createUserValidation } from './body.input-dto.validation-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/query-pagination-sorting.validation-middleware';
import { UserSortField } from './input/user-sort-field';


export const usersRouter: express.Router = Router({});

usersRouter.get(
    '/',
    checkAuthorizationMiddlewares,
    paginationAndSortingValidation(UserSortField),
    getUserListHandler
)

usersRouter.post(
    '/',
    checkAuthorizationMiddlewares,
    createUserValidation,
    createUser
);

usersRouter.delete(
    '/:id',
    checkAuthorizationMiddlewares,
    deleteUser
);