import request from 'supertest';
import { Express } from 'express';
import { POSTS_PATH } from '../../../src/core/constants/paths';
import { PostViewModel } from '../../../src/posts/types/post-view-model';
import { LikeOfPostViewModel } from '../../../src/posts/types/likeOfPost-view-model';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { ErrorMessage } from '../../../src/core/types/errorsMessagesTypes';


export async function createPost(
        app: Express,
        data: {},
        expectedHttpStatus : HttpResponceCodes,
        expectedErrorsMessages?: ErrorMessage[]
    ): Promise<PostViewModel & LikeOfPostViewModel> {
        const responce = await request(app)
            .post(POSTS_PATH)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedHttpStatus);

        const createdEntity: PostViewModel & LikeOfPostViewModel = responce.body;

        if (expectedHttpStatus === HttpResponceCodes.CREATED_201) {
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: createdEntity.title,
                shortDescription: createdEntity.shortDescription,
                content: createdEntity.content,
                blogId: createdEntity.blogId,
                blogName: createdEntity.blogName,
                createdAt: createdEntity.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                }
            });
        }

        if (expectedErrorsMessages) {
            expect(createdEntity).toEqual({ errorsMessages:  expectedErrorsMessages } );
        }

        return createdEntity;
    }
