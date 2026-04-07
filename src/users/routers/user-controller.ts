import { Request, Response } from 'express';
import { UserService } from '../domain/user-service';
import { UsersQueryRepository } from '../repositories/user.query.repository';
import { UserViewModel } from '../types/user-view-model';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-sort-and-pagination';
import { CreateUserDto } from '../types/create-user-dto';
import { API_ERRORS, ErrorsMessages } from '../../core/constants/apiErrors';
import { inject, injectable } from 'inversify';


@injectable()
export class UserController {
    constructor(
        @inject(UserService) protected userService:  UserService,
        @inject(UsersQueryRepository) protected usersQueryRepository:  UsersQueryRepository
    ){}

    async getUserListHandler(req: Request, res: Response) {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    
        const { items, totalCount } = await this.usersQueryRepository.findAll(queryInput);
    
        const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
        const blogViewModel = {
            pagesCount: pagesCount,
            page: +queryInput.pageNumber,
            pageSize: +queryInput.pageSize,
            totalCount: totalCount,
            items,
        };
    
        res.status(HttpResponceCodes.OK_200).send(blogViewModel);
    }

    async createUser(req: Request<{}, {}, CreateUserDto, {}>, res: Response<UserViewModel | ErrorsMessages>) {
        try {
            const { login, password, email } = req.body;
            const userID = await this.userService.createUser({ login, password, email });
            const user = await this.usersQueryRepository.findById(userID);
    
            return res.status(HttpResponceCodes.CREATED_201).send(user!);
        } catch(e: unknown) {
            const err = e as { message: string };
            if (err?.message === 'login is not unique') {
               return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.login.MUST_BE_UNIQUE ]});
            }
    
            if (err?.message === 'email is not unique') {
               return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.email.MUST_BE_UNIQUE ]});
            }
    
            throw new Error(err?.message);
        }
    };
    

    async deleteUser(req: Request<{id: string}, {}, {}, {}>, res: Response<UserViewModel>) {
        try {
            const id = req.params.id;
            const user = await this.usersQueryRepository.findById(id);

            if (!user) {
                return res.status(HttpResponceCodes.NOT_FOUND_404);
            }

            this.userService.deleteUser(id);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e: unknown) {
            console.log(e);
            throw new Error('some error in deleteUserRoute');
        }
    }
}