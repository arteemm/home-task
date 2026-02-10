import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { HttpResponceCodes } from '../src/core/constants/responseCodes'; 
import { CreateBlog, ChangeBlog, BlogViewModel } from '../src/blogs/types/blogs';
import { API_ERRORS } from '../src/core/constants/apiErrors';
import { BLOGS_PATH, TESTING_PATH } from '../src/core/constants/paths';


const blogObjCreate1: CreateBlog = {
    name: 'test1',
    description: 'lol1',
    websiteUrl: 'https://google1mail.ru'
};

const blogObjCreate2: CreateBlog = {
    name: 'test2',
    description: 'lol2',
    websiteUrl: 'https://google2mail.ru'
};

const blogObjCreate3: CreateBlog = {
    name: 'test3',
    description: 'lol3',
    websiteUrl: 'https://google3mail.ru'
};
const blogObjUpdate: ChangeBlog = {name: 'updated1', description: 'updated1', websiteUrl: 'https://updated1.ru'};

let crearedBlog1: BlogViewModel = {  ...blogObjCreate1, id: '1', createdAt: '2', isMembership: false };
let crearedBlog2: BlogViewModel = {  ...blogObjCreate2, id: '2', createdAt: '4', isMembership: false };
let crearedBlog3: BlogViewModel = {  ...blogObjCreate3, id: '3', createdAt: '5', isMembership: false };

 
describe(BLOGS_PATH, () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get(BLOGS_PATH)
        .expect(HttpResponceCodes.OK_200, [])
    });

    it('shouldn\'t create blog with incorrect input data, 400', async () => {
        await request(app)
        .post(BLOGS_PATH)
        .auth('admin', 'qwerty')
        .send({ name: 5, description: 4, websiteUrl: 6 })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.name.NOT_A_STRING, API_ERRORS.description.NOT_A_STRING, API_ERRORS.websiteUrl.NOT_A_STRING ]
        });

        await request(app)
        .post(BLOGS_PATH)
        .auth('admin', 'qwerty')
        .send({ name: '', description: '', websiteUrl: '' })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.name.NOT_FIND, API_ERRORS.description.NOT_FIND, API_ERRORS.websiteUrl.NOT_FIND ]
        });

        await request(app)
        .post(BLOGS_PATH)
        .auth('admin', 'qwerty')
        .send({ name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.name.IS_TOO_LONG, API_ERRORS.websiteUrl.NOT_CORRECT ]
        });

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, []);
    });

    it('should create entity with correct input data, 201', async () => {
        const createResponce = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send(blogObjCreate1)
            .expect(HttpResponceCodes.CREATED_201);

        crearedBlog1 = structuredClone(createResponce.body)
        
        expect(crearedBlog1).toEqual({
            id: expect.any(String),
            name: blogObjCreate1.name,
            description: blogObjCreate1.description,
            websiteUrl: blogObjCreate1.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false,
        });

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [{ ...crearedBlog1 }]);
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        await request(app)
            .post(BLOGS_PATH)
            .auth('admin1', 'qwerty2')
            .send(blogObjCreate1)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .put(BLOGS_PATH + `/${crearedBlog1.id}`)
            .send(blogObjCreate1)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(BLOGS_PATH + `/${crearedBlog1.id}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
        
        await request(app)
            .get(BLOGS_PATH + `/${crearedBlog1.id}`)
            .expect(HttpResponceCodes.OK_200, { ...crearedBlog1 });
    });

    it('should return not found with incorrect id, 404', async () => {
        await request(app)
            .put(BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .send(blogObjCreate1)
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
            .expect(HttpResponceCodes.OK_200, [{ ...crearedBlog1 }]);
    });
    
    it('should create entity with correct input data, 201', async () => {
        const createResponce2 = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send(blogObjCreate2)
            .expect(HttpResponceCodes.CREATED_201);

        crearedBlog2 = structuredClone(createResponce2.body);

        const createResponce3 = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send(blogObjCreate3)
            .expect(HttpResponceCodes.CREATED_201);
            
        crearedBlog3 = structuredClone(createResponce3.body);


        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { ...crearedBlog1 }, { ...crearedBlog2 }, { ...crearedBlog3 } ]);
    });

    it('shouldn\'t update entity with incorrect input data, 400', async () => {
        await request(app)
            .put(BLOGS_PATH + `/${crearedBlog1.id}`)
            .auth('admin', 'qwerty')
            .send({ name: 5, description: 4, websiteUrl: 6 })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.NOT_A_STRING, API_ERRORS.description.NOT_A_STRING, API_ERRORS.websiteUrl.NOT_A_STRING ]
        });

        await request(app)
            .put(BLOGS_PATH + `/${crearedBlog1.id}`)
            .auth('admin', 'qwerty')
            .send({ name: '', description: '', websiteUrl: '' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.NOT_FIND, API_ERRORS.description.NOT_FIND, API_ERRORS.websiteUrl.NOT_FIND ]
        });

        await request(app)
            .put(BLOGS_PATH + `/${crearedBlog1.id}`)
            .auth('admin', 'qwerty')
            .send({ name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.IS_TOO_LONG, API_ERRORS.websiteUrl.NOT_CORRECT ]
        });

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { ...crearedBlog1 }, { ...crearedBlog2 }, { ...crearedBlog3 } ]);
    });

    it('should update entity with correct input data, 201', async () => {
        await request(app)
            .put(BLOGS_PATH + `/${crearedBlog1.id}`)
            .auth('admin', 'qwerty')
            .send(blogObjUpdate)
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { ...crearedBlog1, ...blogObjUpdate }, { ...crearedBlog2 }, { ...crearedBlog3 } ]);
    });

    it('should delete entity with correct  id, 201', async () => {
        await request(app)
            .delete(BLOGS_PATH + `/${crearedBlog2.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { ...crearedBlog1, ...blogObjUpdate }, { ...crearedBlog3 } ]);
    });
});