import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { BlogViewModel } from '../../../src/blogs/types/blog-view-model';
import { PostViewModel } from '../../../src/posts/types/post-view-model';
import { POSTS_PATH, TESTING_PATH, COMMENTS_PATH } from '../../../src/core/constants/paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { createUser } from '../../utils/users/create-user';
import { loginUser } from '../../utils/users/login-user';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createComment } from '../../utils/comments/create-comment';
import { getCommentDto } from '../../utils/comments/get-comment-dto';
import { CommentViewModel } from '../../../src/comments/types/commentViewModel';
import { API_ERRORS } from '../../../src/core/constants/apiErrors';
import mongoose from 'mongoose';


describe('Comments API body validation check', () => {
    const app = express();
    setupApp(app);

    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let blog: BlogViewModel = {} as BlogViewModel;
    let post: PostViewModel ={} as PostViewModel;
    let user: UserViewModel = {} as UserViewModel;
    let accessToken: string;
    let comment: CommentViewModel = {} as CommentViewModel;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await request(app).delete(TESTING_PATH);
    
            user = await createUser(
                app,
                getUserDto(),
                HttpResponceCodes.CREATED_201,
            );
            const payload = await loginUser(
                app,
                {
                    loginOrEmail: user.login,
                    password: getUserDto().password,
                },
                HttpResponceCodes.OK_200
            );
    
            accessToken = payload.accessToken;
    
            blog = await createBlog(
                app,
                getBlogDto(),
                HttpResponceCodes.CREATED_201,
            );
    
            post = await createPost(
                app,
                getPostDto({blogId: blog.id}),
                HttpResponceCodes.CREATED_201,
            )
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('shouldn\'t create comment with incorrect data , 400', async () => {
        await createComment(
            app,
            getCommentDto({content: '222'}),
            HttpResponceCodes.BAD_REQUEST_400,
            post.id,
            accessToken,
            {
                userId: user.id,
                userLogin: user.login,
            },
            [ API_ERRORS.content.IS_TOO_LONG ]
        );

        await createComment(
            app,
            getCommentDto({content: 555} as any),
            HttpResponceCodes.BAD_REQUEST_400,
            post.id,
            accessToken,
            {
                userId: user.id,
                userLogin: user.login,
            },
            [ API_ERRORS.content.NOT_A_STRING ]
        );


        const response = await request(app)
            .get(POSTS_PATH + `/${post.id}/comments`)
            .expect(HttpResponceCodes.NOT_FOUND_404);
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        const createResponce = await createComment(
            app,
            getCommentDto(),
            HttpResponceCodes.CREATED_201,
            post.id,
            accessToken,
            {
                userId: user.id,
                userLogin: user.login,
            }
        );
        comment = structuredClone(createResponce);


        await request(app)
            .post(POSTS_PATH + `/${post.id}/comments`)
            .set('Authorization', `Bearer ${'213141241441221.sfds.erew'}`)
            .send(getUserDto())
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .put(COMMENTS_PATH + `/${comment.id}`)
            .send(getUserDto())
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(COMMENTS_PATH + `/${comment.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
             
        const responce = await request(app)
            .get(POSTS_PATH + `/${post.id}/comments`);

        expect(responce.body.items).toHaveLength(1)

        expect(responce.body.items[0]).toMatchObject({
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
        });
    });

    it('should return not found with incorrect id, 404', async () => {
        await request(app)
            .post(POSTS_PATH + `/${'14231'}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(getCommentDto())
            .expect(HttpResponceCodes.NOT_FOUND_404);

        await request(app)
            .put(COMMENTS_PATH + `/${'1231'}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(getCommentDto())
            .expect(HttpResponceCodes.NOT_FOUND_404);

        await request(app)
            .delete(COMMENTS_PATH + `/${'412341'}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpResponceCodes.NOT_FOUND_404);
             
        const responce = await request(app)
            .get(POSTS_PATH + `/${post.id}/comments`);

        expect(responce.body.items).toHaveLength(1)

        expect(responce.body.items[0]).toMatchObject({
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
        });
    });

    it('shouldn\'t update entity with incorrect input data, 400', async () => {
        const testEntities1 = await createComment(
            app,
            getCommentDto({content: 'ololsldkflrmvlfdkvdke'}),
            HttpResponceCodes.CREATED_201,
            post.id,
            accessToken,
            {
                userId: user.id,
                userLogin: user.login,
            }
        );
        const testEntities2 = await createComment(
            app,
            getCommentDto({content: 'rtyuifkrniekvpslekikcm'}),
            HttpResponceCodes.CREATED_201,
            post.id,
            accessToken,
            {
                userId: user.id,
                userLogin: user.login,
            }
        );  

        await request(app)
            .put(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 4654})
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.content.NOT_A_STRING ]
        });

        await request(app)
            .put(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: ''})
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.content.NOT_FIND ]
        });

        await request(app)
            .put(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({content: 'asd'})
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.content.IS_TOO_LONG ]
        });

        const responce = await request(app)
            .get(POSTS_PATH + `/${post.id}/comments`);


        expect(responce.body.items).toHaveLength(3)

        expect(responce.body.items[1]).toMatchObject({
            id: testEntities1.id,
            content: 'ololsldkflrmvlfdkvdke',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: testEntities1.createdAt,
        });

        expect(responce.body.items[0]).toMatchObject({
            id: testEntities2.id,
            content: 'rtyuifkrniekvpslekikcm',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: testEntities2.createdAt,
        });

        expect(responce.body.items[2]).toMatchObject({
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
        });
    });

    it('shouldn\'t update and delete entity with OTHER user, 403', async () => {
        const otherUser = await createUser(
                app,
                getUserDto({
                    login: 'other',
                    email: 'otherUser@mail.ru'
                }),
                HttpResponceCodes.CREATED_201,
            );

        const payload = await loginUser(
            app,
            {
                loginOrEmail: otherUser.login,
                password: getUserDto().password,
            },
            HttpResponceCodes.OK_200
        );
    
        const otherAccessToken = payload.accessToken;
        const updateDto = { content: '1234567890qwertyuioasdf' };

        await request(app)
            .put(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${otherAccessToken}`)
            .send(getCommentDto(updateDto))
            .expect(HttpResponceCodes.FORBIDDEN_403);

        await request(app)
            .delete(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${otherAccessToken}`)
            .expect(HttpResponceCodes.FORBIDDEN_403);

        const responce = await request(app)
            .get(COMMENTS_PATH + `/${comment.id}`)
        
        expect(responce.body).toMatchObject({
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
        });
    });
});