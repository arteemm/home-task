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

 
describe(COMMENTS_PATH, () => {
    const app = express();
    setupApp(app);

    let blog: BlogViewModel = {} as BlogViewModel;
    let post: PostViewModel ={} as PostViewModel;
    let user: UserViewModel = {} as UserViewModel;
    let accessToken: string;
    let comment: CommentViewModel = {} as CommentViewModel;

    beforeAll(async () => {
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

        const updateDto = { content: '1234567890qwertyuioasdf' };

        await request(app)
            .put(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(getCommentDto(updateDto))
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
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
            content: updateDto.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
        });
    });

    it('should delete entity with correct  id, 201', async () => {
        await request(app)
            .delete(COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpResponceCodes.NO_CONTENT_204);
        ``
        await request(app)
            .get(COMMENTS_PATH + `/${comment.id}`).expect(HttpResponceCodes.NOT_FOUND_404);
        
        const response = await request(app)
            .get(POSTS_PATH + `/${post.id}/comments`)
            .expect(HttpResponceCodes.OK_200);

            expect(response.body.items).toBeInstanceOf(Array);
            expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    });

    afterAll((done) => {
        done();  
    })
});