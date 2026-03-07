import request from 'supertest';
import { Express } from 'express';
import { AUTH_PATH } from '../../../src/core/constants/paths';
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { ErrorMessage } from '../../../src/core/types/errorsMessagesTypes';


export async function loginUser(
        app: Express,
        data: {},
        expectedHttpStatus : HttpResponceCodes,
        expectedErrorsMessages?: ErrorMessage[]
    ): Promise<void> {
        const responce = await request(app)
            .post(AUTH_PATH + '/login')
            .send(data)
            .expect(expectedHttpStatus);
        
        if (expectedHttpStatus === HttpResponceCodes.NO_CONTENT_204) {
            expect(expectedHttpStatus).toEqual(HttpResponceCodes.NO_CONTENT_204);
        }

        if (expectedHttpStatus === HttpResponceCodes.NOT_AUTHORIZED_401) {
            expect(expectedHttpStatus).toEqual(HttpResponceCodes.NOT_AUTHORIZED_401);
        }


        if (expectedErrorsMessages) {
            expect(responce.body).toEqual({ errorsMessages:  expectedErrorsMessages } );
        }
    }
