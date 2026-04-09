import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { CommentViewModel } from '../../../src/comments/types/commentViewModel';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { ErrorMessage } from '../../../src/core/types/errorsMessagesTypes';
import { CreateCommentDto } from '../../../src/comments/types/create-comment-dto';


export async function createComment(
        app: Express,
        data = {} as CreateCommentDto,
        expectedHttpStatus : HttpResponceCodes,
        postId: string,
        token: string,
        user: {
            userId: string,
            userLogin: string;
        },
        expectedErrorsMessages?: ErrorMessage[],
    ): Promise<CommentViewModel> {
        const responce = await request(app)
            .post(POSTS_PATH + `/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedHttpStatus);

        const createdEntity: CommentViewModel = responce.body;
        
        if (expectedHttpStatus === HttpResponceCodes.CREATED_201) {
            expect(createdEntity).toEqual({
                id: expect.any(String),
                content: data.content,
                commentatorInfo: {
                    userId: user.userId,
                    userLogin: user.userLogin,
                },
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                }
            });
        }

        if (expectedErrorsMessages) {
            expect(createdEntity).toEqual({ errorsMessages:  expectedErrorsMessages } );
        }

        return createdEntity;
    }
