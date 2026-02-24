import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { PostViewModel } from '../../../src/posts/types/posts';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { ErrorMessage } from '../../../src/core/types/errorsMessagesTypes';


export async function createPost(
        app: Express,
        data: {},
        expectedHttpStatus : HttpResponceCodes,
        expectedErrorsMessages?: ErrorMessage[]
    ): Promise<PostViewModel> {
        const responce = await request(app)
            .post(POSTS_PATH)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedHttpStatus);

        const createdEntity: PostViewModel = responce.body;
        
        if (expectedHttpStatus === HttpResponceCodes.CREATED_201) {
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: createdEntity.title,
                shortDescription: createdEntity.shortDescription,
                content: createdEntity.content,
                blogId: createdEntity.blogId,
                blogName: createdEntity.blogName,
                createdAt: createdEntity.createdAt,
            });
        }

        if (expectedErrorsMessages) {
            expect(createdEntity).toEqual({ errorsMessages:  expectedErrorsMessages } );
        }

        return createdEntity;
    }
