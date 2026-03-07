import request from 'supertest';
import { Express } from 'express';
import { USER_PATH } from '../../../src/core/constants/paths';
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { ErrorMessage } from '../../../src/core/types/errorsMessagesTypes';


export async function createUser(
        app: Express,
        data: {},
        expectedHttpStatus : HttpResponceCodes,
        expectedErrorsMessages?: ErrorMessage[]
    ): Promise<UserViewModel> {
        const responce = await request(app)
            .post(USER_PATH)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedHttpStatus);

        const createdEntity: UserViewModel = responce.body;
        
        if (expectedHttpStatus === HttpResponceCodes.CREATED_201) {
            expect(createdEntity).toEqual({
                id: expect.any(String),
                login: createdEntity.login,
                email: createdEntity.email,
                createdAt: createdEntity.createdAt
            });
        }

        if (expectedErrorsMessages) {
            expect(createdEntity).toEqual({ errorsMessages:  expectedErrorsMessages } );
        }

        return createdEntity;
    }
