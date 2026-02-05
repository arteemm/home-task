import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { HttpResponceCodes } from '../src/core/constants/responseCodes'; 
import { Post, CreatePost, ChangePost } from '../src/posts/types/posts';
import { Blog} from '../src/blogs/types/blogs';
import { API_ERRORS } from './constants/apiErrors';
import { POSTS_PATH, TESTING_PATH, BLOGS_PATH } from '../src/core/constants/paths';

const blog: Blog = { id: '1', name: 'test1', description: 'lol1', websiteUrl: 'https://google1mail.ru'}

const postObjCreate1: CreatePost = {
    title: 'test1',
    shortDescription: 'lol1',
    content: 'https://google1mail.ru',
    blogId: '',
};

const postObjCreate2: CreatePost = {
    title: 'test2',
    shortDescription: 'lol2',
    content: 'https://google2mail.ru',
    blogId: '2',
};

const postObjCreate3: CreatePost = {
    title: 'test3',
    shortDescription: 'lol3',
    content: 'https://google3mail.ru',
    blogId: '3',
};

const postObjUpdate: ChangePost = {title: 'updated1', shortDescription: 'updated1', content: 'https://updated1.ru', blogId: blog.id};


let id: string = '1';
let id2: string = '1';
let id3: string = '1';
 
describe(POSTS_PATH, () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get(POSTS_PATH)
        .expect(HttpResponceCodes.OK_200, [])
    });

    it('shouldn\'t create blog with incorrect input data, 400', async () => {
        await request(app)
        .post(POSTS_PATH)
        .auth('admin', 'qwerty')
        .send({ title: 5, shortDescription: 4, content: 6, blogId: 1 })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.title.NOT_A_STRING, API_ERRORS.shortDescription.NOT_A_STRING, API_ERRORS.content.NOT_A_STRING, API_ERRORS.blogId.NOT_A_STRING ]
        });

        await request(app)
        .post(POSTS_PATH)
        .auth('admin', 'qwerty')
        .send({ title: '', shortDescription: '', content: '', blogId: '' })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.title.NOT_FIND, API_ERRORS.shortDescription.NOT_FIND, API_ERRORS.content.NOT_FIND, API_ERRORS.blogId.NOT_FIND ]
        });

        await request(app)
        .post(POSTS_PATH)
        .auth('admin', 'qwerty')
        .send({ title: 'yturiehfjdnxhddfyturiehfjdnxhddfyturiehfjdnxhddf', shortDescription: '6', blogId: '1' })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.content.NOT_FIND, API_ERRORS.title.IS_TOO_LONG, API_ERRORS.blogId.NOT_FIND_BLOG_ID ]
        });

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, []);
    });

    it('should create entity with correct input data, 201', async () => {
        const newBlog = await request(app)
            .post(BLOGS_PATH)
            .auth('admin', 'qwerty')
            .send({ name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl })
            .expect(HttpResponceCodes.CREATED_201);

        postObjCreate1.blogId = newBlog.body.id;
        blog.id = newBlog.body.id;

        const createResponce = await request(app)
            .post(POSTS_PATH)
            .auth('admin', 'qwerty')
            .send(postObjCreate1)
            .expect(HttpResponceCodes.CREATED_201);

        const createdEntity: Post = createResponce.body;
        id = createdEntity.id;
        
        expect(createdEntity).toEqual({
            id: expect.any(String),
            title: createdEntity.title,
            shortDescription: createdEntity.shortDescription,
            content: createdEntity.content,
            blogId: createdEntity.blogId,
            blogName: newBlog.body.name,
        });

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, [{
                id,
                ...postObjCreate1,
                blogName: blog.name,
        }]);
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        await request(app)
            .post(POSTS_PATH)
            .auth('admin1', 'qwerty2')
            .send(postObjCreate1)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .put(POSTS_PATH + `/${id}`)
            .send(postObjCreate1)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(POSTS_PATH + `/${id}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
        
        await request(app)
            .get(POSTS_PATH + `/${id}`)
            .expect(HttpResponceCodes.OK_200, {
                id,
                ...postObjCreate1,
                blogName: blog.name,
        });
    });

    it('should return not found with incorrect id, 404', async () => {
        await request(app)
            .put(POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .send(postObjCreate1)
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
            .expect(HttpResponceCodes.OK_200, [{
                id,
                ...postObjCreate1,
                blogName: blog.name,
        }]);
    });
    
    it('should create entity with correct input data, 201', async () => {
        postObjCreate2.blogId = blog.id;
        postObjCreate3.blogId = blog.id;

        const createResponce2 = await request(app)
            .post(POSTS_PATH)
            .auth('admin', 'qwerty')
            .send(postObjCreate2)
            .expect(HttpResponceCodes.CREATED_201);

        id2 = createResponce2.body.id;

        const createResponce3 = await request(app)
            .post(POSTS_PATH)
            .auth('admin', 'qwerty')
            .send(postObjCreate3)
            .expect(HttpResponceCodes.CREATED_201);
            
        id3 = createResponce3.body.id;

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, [ 
                { id, ...postObjCreate1, blogName: blog.name,  },
                { id: id2, ...postObjCreate2,  blogName: blog.name },
                { id: id3, ...postObjCreate3,  blogName: blog.name }
            ]);
    });

    it('shouldn\'t update entity with incorrect input data, 400', async () => {
        await request(app)
            .put(POSTS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send({ title: 5, shortDescription: 4, content: 6, blogId: 1 })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.title.NOT_A_STRING, API_ERRORS.shortDescription.NOT_A_STRING, API_ERRORS.content.NOT_A_STRING, API_ERRORS.blogId.NOT_A_STRING ]
        });

        await request(app)
            .put(POSTS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send({ title: '', shortDescription: '', content: '', blogId: '' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.title.NOT_FIND, API_ERRORS.shortDescription.NOT_FIND, API_ERRORS.content.NOT_FIND, API_ERRORS.blogId.NOT_FIND ]
        });

        await request(app)
            .put(POSTS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send({ title: 'yturiehfjdnxhddfyturiehfjdnxhddfyturiehfjdnxhddf', shortDescription: '6', blogId: '1' })
            .expect(HttpResponceCodes.BAD_REQUEST_400, {
                errorsMessages: [ API_ERRORS.content.NOT_FIND, API_ERRORS.title.IS_TOO_LONG, API_ERRORS.blogId.NOT_FIND_BLOG_ID ]
        });

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, [ 
                { id, ...postObjCreate1, blogName: blog.name,  },
                { id: id2, ...postObjCreate2,  blogName: blog.name },
                { id: id3, ...postObjCreate3,  blogName: blog.name }
            ]);
    });

    it('should update entity with correct input data, 201', async () => {
        postObjUpdate.blogId = blog.id;

        await request(app)
            .put(POSTS_PATH + `/${id}`)
            .auth('admin', 'qwerty')
            .send(postObjUpdate)
            .expect(HttpResponceCodes.NO_CONTENT_204);
        

        await request(app)
        .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, [ 
                { id, ...postObjUpdate, blogName: blog.name,  },
                { id: id2, ...postObjCreate2,  blogName: blog.name },
                { id: id3, ...postObjCreate3,  blogName: blog.name }
        ]);
    });

    it('should delete entity with correct  id, 201', async () => {
        await request(app)
            .delete(POSTS_PATH + `/${id2}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
        .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, [ 
                { id, ...postObjUpdate, blogName: blog.name,  },
                { id: id3, ...postObjCreate3,  blogName: blog.name }
        ]);
    });
});
