import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { BlogViewModel } from '../../../src/blogs/types/blogs';
import { API_ERRORS } from '../../../src/core/constants/apiErrors';
import { BLOGS_PATH, TESTING_PATH } from '../../../src/core/constants/paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';


describe('Blog API body validation check', () => {
    const app = express();
    setupApp(app);

    let testEntity: BlogViewModel = {} as BlogViewModel;

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('shouldn\'t create entity with incorrect input data, 400', async () => {
        await createBlog(
            app,
            { name: 5, description: 4, websiteUrl: 6 },
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.name.NOT_A_STRING, API_ERRORS.description.NOT_A_STRING, API_ERRORS.websiteUrl.NOT_A_STRING ]
        );

        await createBlog(
            app,
            { name: '', description: '', websiteUrl: '' },
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.name.NOT_FIND, API_ERRORS.description.NOT_FIND, API_ERRORS.websiteUrl.NOT_FIND ]
        );

        await createBlog(
            app,
            { name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' },
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.name.IS_TOO_LONG, API_ERRORS.websiteUrl.NOT_CORRECT ]
        );

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        testEntity= await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);

        await request(app)
            .post(BLOGS_PATH)
            .auth('admin1', 'qwerty2')
            .send(getBlogDto())
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .put(BLOGS_PATH + `/${testEntity.id}`)
            .send(getBlogDto())
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(BLOGS_PATH + `/${testEntity.id}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
        
        await request(app)
            .get(BLOGS_PATH + `/${testEntity.id}`)
            .expect(HttpResponceCodes.OK_200, { ...testEntity });
    });

    it('should return not found with incorrect id, 404', async () => {
        await request(app)
            .put(BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .send(getBlogDto())
            .expect(HttpResponceCodes.NOT_FOUND_404);

        await request(app)
            .delete(BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NOT_FOUND_404);
        
        await request(app)
            .get(BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NOT_FOUND_404);

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{ ...testEntity }] });
    });

    it('shouldn\'t update entity with incorrect input data, 400', async () => {
        const testEntities1 = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);
        const testEntities2 = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);  

        await request(app)
            .put(BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ name: 5, description: 4, websiteUrl: 6 })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.NOT_A_STRING, API_ERRORS.description.NOT_A_STRING, API_ERRORS.websiteUrl.NOT_A_STRING ]
        });

        await request(app)
            .put(BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ name: '', description: '', websiteUrl: '' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.NOT_FIND, API_ERRORS.description.NOT_FIND, API_ERRORS.websiteUrl.NOT_FIND ]
        });

        await request(app)
            .put(BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.IS_TOO_LONG, API_ERRORS.websiteUrl.NOT_CORRECT ]
        });

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items:[
                {...testEntities2},
                {...testEntities1},
                { ...testEntity }
            ]});
    });

    afterAll((done) => {
        done();  
    })
});