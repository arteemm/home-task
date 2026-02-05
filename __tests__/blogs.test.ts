import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { HttpResponceCodes } from '../src/core/constants/responseCodes'; 
import { Blog, CreateBlog, ChangeBlog } from '../src/blogs/types/blogs';
import { API_ERRORS } from './constants/apiErrors';
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


let id: string = '1';
let id2: string = '1';
let id3: string = '1';
 
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

        const createdEntity: Blog = createResponce.body;
        id = createdEntity.id;
        
        expect(createdEntity).toEqual({
            id: expect.any(String),
            name: createdEntity.name,
            description: createdEntity.description,
            websiteUrl: createdEntity.websiteUrl,
        });

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [{
                id,
                ...blogObjCreate1
        }]);
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        await request(app)
            .post(BLOGS_PATH)
            .auth('admin1', 'qwerty2')
            .send(blogObjCreate1)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .put(BLOGS_PATH + `/${id}`)
            .send(blogObjCreate1)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(BLOGS_PATH + `/${id}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
        
        await request(app)
            .get(BLOGS_PATH + `/${id}`)
            .expect(HttpResponceCodes.OK_200, {
                id,
                ...blogObjCreate1
        });
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
            .expect(HttpResponceCodes.OK_200, [{
                id,
                ...blogObjCreate1
        }]);
    });
    
    it('should create entity with correct input data, 201', async () => {
        const createResponce2 = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send(blogObjCreate2)
            .expect(HttpResponceCodes.CREATED_201);

        id2 = createResponce2.body.id;

        const createResponce3 = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send(blogObjCreate3)
            .expect(HttpResponceCodes.CREATED_201);
            
        id3 = createResponce3.body.id;


        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { id, ...blogObjCreate1 }, { id: id2, ...blogObjCreate2 }, { id: id3, ...blogObjCreate3 } ]);
    });

    it('shouldn\'t update entity with incorrect input data, 400', async () => {
        await request(app)
            .put(BLOGS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send({ name: 5, description: 4, websiteUrl: 6 })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.NOT_A_STRING, API_ERRORS.description.NOT_A_STRING, API_ERRORS.websiteUrl.NOT_A_STRING ]
        });

        await request(app)
            .put(BLOGS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send({ name: '', description: '', websiteUrl: '' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.NOT_FIND, API_ERRORS.description.NOT_FIND, API_ERRORS.websiteUrl.NOT_FIND ]
        });

        await request(app)
            .put(BLOGS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send({ name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.name.IS_TOO_LONG, API_ERRORS.websiteUrl.NOT_CORRECT ]
        });

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { id, ...blogObjCreate1 }, { id: id2, ...blogObjCreate2 }, { id: id3, ...blogObjCreate3 } ]);
    });

    it('should update entity with correct input data, 201', async () => {
        await request(app)
            .put(BLOGS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send(blogObjUpdate)
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { id, ...blogObjUpdate }, { id: id2, ...blogObjCreate2 }, { id: id3, ...blogObjCreate3 } ]);
    });

    it('should delete entity with correct  id, 201', async () => {
        await request(app)
            .delete(BLOGS_PATH + `/${id2}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, [ { id, ...blogObjUpdate }, { id: id3, ...blogObjCreate3 } ]);
    });
});