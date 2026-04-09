import request from 'supertest';
import express from 'express';
import { app } from '../../../src/setup-app';
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
import mongoose from 'mongoose';

 
describe(COMMENTS_PATH, () => {
    const PORT = 5002;
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';

    let blog: BlogViewModel = {} as BlogViewModel;
    let post: PostViewModel ={} as PostViewModel;
    let user: UserViewModel = {} as UserViewModel;
    let accessToken: string;
    let comment: CommentViewModel = {} as CommentViewModel;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        app.listen(PORT)

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


    it('should return 200 and empty array', async () => {
        await request(app)
        .get(POSTS_PATH + `/${post.id}/comments`)
        .expect(HttpResponceCodes.NOT_FOUND_404)
    });

    it('should create entity with correct input data, 201', async () => {
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
            .get(COMMENTS_PATH + `/${comment.id}`)
            .expect(HttpResponceCodes.OK_200, { ...createResponce });
    });

    it('should update entity with correct input data, 201', async () => {
        await request(app).delete(COMMENTS_PATH + `/${comment.id}`).set('Authorization', `Bearer ${accessToken}`).expect(HttpResponceCodes.NO_CONTENT_204);
     

        const login2 = 'login2';
        const password2 = 'login2';
        const email2 = 'login2@mail.ru';
        const login3 = 'login3';
        const password3 = 'login3';
        const email3 = 'login3@mail.ru';
        const login4 = 'login4';
        const password4 = 'login4';
        const email4 = 'login4@mail.ru';

        const user2 = await createUser( app, getUserDto({login: login2, password: password2, email: email2}), HttpResponceCodes.CREATED_201);
        const payload2 = await loginUser(app, {loginOrEmail: login2, password: password2 }, HttpResponceCodes.OK_200);
        const accessToken2 = payload2.accessToken;
        const user3 = await createUser( app, getUserDto({login: login3, password: password3, email: email3}), HttpResponceCodes.CREATED_201);
        const payload3 = await loginUser(app, {loginOrEmail: login3, password: password3 }, HttpResponceCodes.OK_200);
        const accessToken3 = payload3.accessToken;
        const user4 = await createUser( app, getUserDto({login: login4, password: password4, email: email4}), HttpResponceCodes.CREATED_201);
        const payload4 = await loginUser(app, {loginOrEmail: login4, password: password4 }, HttpResponceCodes.OK_200);
        const accessToken4 = payload4.accessToken;

        const comment1 = await createComment( app, getCommentDto({content: 'sssssssssssssssstring1'}), HttpResponceCodes.CREATED_201, post.id, accessToken, { userId: user.id, userLogin: user.login } );
        const comment2 = await createComment( app, getCommentDto({content: 'sssssssssssssssstring2'}), HttpResponceCodes.CREATED_201, post.id, accessToken, { userId: user.id, userLogin: user.login } );
        const comment3 = await createComment( app, getCommentDto({content: 'sssssssssssssssstring3'}), HttpResponceCodes.CREATED_201, post.id, accessToken, { userId: user.id, userLogin: user.login } );
        const comment4 = await createComment( app, getCommentDto({content: 'sssssssssssssssstring4'}), HttpResponceCodes.CREATED_201, post.id, accessToken, { userId: user.id, userLogin: user.login } );
        const comment5 = await createComment( app, getCommentDto({content: 'sssssssssssssssstring5'}), HttpResponceCodes.CREATED_201, post.id, accessToken, { userId: user.id, userLogin: user.login } );
        const comment6 = await createComment( app, getCommentDto({content: 'sssssssssssssssstring6'}), HttpResponceCodes.CREATED_201, post.id, accessToken, { userId: user.id, userLogin: user.login } );

        await request(app).put(COMMENTS_PATH + `/${comment1.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment1.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment2.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment2.id}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment3.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Dislike'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment4.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment4.id}/like-status`).set('Authorization', `Bearer ${accessToken4}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment4.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment4.id}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment5.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment5.id}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send({likeStatus: 'Dislike'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment6.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(COMMENTS_PATH + `/${comment6.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Dislike'}).expect(HttpResponceCodes.NO_CONTENT_204);
       
        const result = await request(app)
            .get(POSTS_PATH + `/${post.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpResponceCodes.OK_200);
        
        expect(result.body).toEqual({
                "pagesCount":1,"page":1,"pageSize":10,"totalCount":6,"items":[
                    {
                        "id":comment6.id,
                        "content":getCommentDto({content: 'sssssssssssssssstring6'}).content,
                        "commentatorInfo":{"userId":user.id,"userLogin":user.login},
                        "createdAt": expect.any(String),
                        "likesInfo":{"likesCount":1,"dislikesCount":1,"myStatus":"Like"}
                    },
                    {
                        "id":comment5.id,
                        "content":getCommentDto({content: 'sssssssssssssssstring5'}).content,
                        "commentatorInfo":{"userId":user.id,"userLogin":user.login},
                        "createdAt": expect.any(String),
                        "likesInfo":{"likesCount":1,"dislikesCount":1,"myStatus":"None"}
                    },
                    {
                        "id":comment4.id,
                        "content":getCommentDto({content: 'sssssssssssssssstring4'}).content,
                        "commentatorInfo":{"userId":user.id,"userLogin":user.login},
                        "createdAt": expect.any(String),
                        "likesInfo":{"likesCount":4,"dislikesCount":0,"myStatus":"Like"}
                    },
                    {
                        "id":comment3.id,
                        "content":getCommentDto({content: 'sssssssssssssssstring3'}).content,
                        "commentatorInfo":{"userId":user.id,"userLogin":user.login},
                        "createdAt": expect.any(String),
                        "likesInfo":{"likesCount":0,"dislikesCount":1,"myStatus":"Dislike"}
                    },
                    {
                        "id":comment2.id,
                        "content":getCommentDto({content: 'sssssssssssssssstring2'}).content,
                        "commentatorInfo":{"userId":user.id,"userLogin":user.login},
                        "createdAt": expect.any(String),
                        "likesInfo":{"likesCount":2,"dislikesCount":0,"myStatus":"None"}
                    },
                    {
                        "id":comment1.id,
                        "content":getCommentDto({content: 'sssssssssssssssstring1'}).content,
                        "commentatorInfo":{"userId":user.id,"userLogin":user.login},
                        "createdAt": expect.any(String),
                        "likesInfo":{"likesCount":2,"dislikesCount":0,"myStatus":"Like"}
                    },
                ]})
    })
});