import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from '../../../src/core/constants/paths';
import { BlogViewModel } from '../../../src/blogs/types/blog-view-model';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { ErrorMessage } from '../../../src/core/types/errorsMessagesTypes';


export async function createBlog(
        app: Express,
        data: {},
        expectedHttpStatus : HttpResponceCodes,
        expectedErrorsMessages?: ErrorMessage[]
    ): Promise<BlogViewModel> {
        const responce = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedHttpStatus);

        const createdEntity: BlogViewModel = responce.body;
        
        if (expectedHttpStatus === HttpResponceCodes.CREATED_201) {
            expect(createdEntity).toEqual({
                id: expect.any(String),
                name: createdEntity.name,
                description: createdEntity.description,
                websiteUrl: createdEntity.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false,
            });
        }

        if (expectedErrorsMessages) {
            expect(createdEntity).toEqual({ errorsMessages:  expectedErrorsMessages } );
        }

        return createdEntity;
    }
