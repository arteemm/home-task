import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { PostViewModel } from '../../../src/posts/types/post-view-model';
import { API_ERRORS } from '../../../src/core/constants/apiErrors';
import { TESTING_PATH, POSTS_PATH } from '../../../src/core/constants/paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import mongoose from 'mongoose';


describe('Post API body validation check', () => {
    const app = express();
    setupApp(app);
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';

    let testEntity: PostViewModel = {} as PostViewModel;
    let testBlogId: string = '';

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await request(app).delete(TESTING_PATH);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });


    it('shouldn\'t create entity with incorrect input data, 400', async () => {
        await createPost(
            app,
            { title: 5, shortDescription: 4, content: 6, blogId: 1 },
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.title.NOT_A_STRING, API_ERRORS.shortDescription.NOT_A_STRING, API_ERRORS.content.NOT_A_STRING, API_ERRORS.blogId.NOT_A_STRING ]
        );

        await createPost(
            app,
            { title: '', shortDescription: '', content: '', blogId: '' },
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.title.NOT_FIND, API_ERRORS.shortDescription.NOT_FIND, API_ERRORS.content.NOT_FIND, API_ERRORS.blogId.NOT_FIND ]
        );

        await createPost(
            app,
            { title: 'yturiehfjdnxhddfyturiehfjdnxhddfyturiehfjdnxhddf', shortDescription: '6', blogId: '1' },
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.title.IS_TOO_LONG, API_ERRORS.content.NOT_FIND, API_ERRORS.blogId.NOT_FIND_BLOG_ID ]
        );

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        const createBlod = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);
        testBlogId = createBlod.id;
        testEntity = await createPost(app, getPostDto({blogId: testBlogId}), HttpResponceCodes.CREATED_201);
        
        await request(app)
            .post(POSTS_PATH)
            .auth('admin1', 'qwerty2')
            .send(getPostDto({blogId: testBlogId}))
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .put(POSTS_PATH + `/${testEntity.id}`)
            .send(getPostDto({blogId: testBlogId}))
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(POSTS_PATH + `/${testEntity.id}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
        
        await request(app)
            .get(POSTS_PATH + `/${testEntity.id}`)
            .expect(HttpResponceCodes.OK_200, { ...testEntity });
    });

    it('should return not found with incorrect id, 404', async () => {
        await request(app)
            .put(POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .send(getPostDto({blogId: testBlogId}))
            .expect(HttpResponceCodes.NOT_FOUND_404);

        await request(app)
            .delete(POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NOT_FOUND_404);
        
        await request(app)
            .get(POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NOT_FOUND_404);

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{ ...testEntity }] });
    });

    it('shouldn\'t update entity with incorrect input data, 400', async () => {
        const testEntities1 = await createPost(app, getPostDto({blogId: testBlogId}), HttpResponceCodes.CREATED_201);;
        const testEntities2 = await createPost(app, getPostDto({blogId: testBlogId}), HttpResponceCodes.CREATED_201);;  

        await request(app)
            .put(POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ title: 5, shortDescription: 4, content: 6, blogId: 1 })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.title.NOT_A_STRING, API_ERRORS.shortDescription.NOT_A_STRING, API_ERRORS.content.NOT_A_STRING, API_ERRORS.blogId.NOT_A_STRING ]
        });

        await request(app)
            .put(POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ title: '', shortDescription: '', content: '', blogId: '' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.title.NOT_FIND, API_ERRORS.shortDescription.NOT_FIND, API_ERRORS.content.NOT_FIND, API_ERRORS.blogId.NOT_FIND ]
        });

        await request(app)
            .put(POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ title: 'yturiehfjdnxhddfyturiehfjdnxhddfyturiehfjdnxhddf', shortDescription: '6', blogId: '1' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [  API_ERRORS.title.IS_TOO_LONG, API_ERRORS.content.NOT_FIND, API_ERRORS.blogId.NOT_FIND_BLOG_ID ]
        });

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items:[
                {...testEntities2},
                {...testEntities1},
                { ...testEntity }
            ]});
    });
});