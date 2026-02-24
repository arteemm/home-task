import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { BlogViewModel } from '../../../src/blogs/types/blogs';
import { BLOGS_PATH, TESTING_PATH } from '../../../src/core/constants/paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { getPostDtoWithoutBlogId, getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';

 
describe(BLOGS_PATH, () => {
    const app = express();
    setupApp(app);

    let testEntity: BlogViewModel = {} as BlogViewModel;

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get(BLOGS_PATH)
        .expect(HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    });

    it('should create entity with correct input data, 201', async () => {
        const createResponce = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);

        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{ ...createResponce }] });
    });

    it('should create post in a blog with correct input data, 201', async () => {
        const createEntity1 = await createPost(app, getPostDto({blogId: testEntity.id}), HttpResponceCodes.CREATED_201);
        const createEntity2 = await createPost(app, getPostDto({blogId: testEntity.id}), HttpResponceCodes.CREATED_201);

        const createResponce = await request(app)
            .post(BLOGS_PATH + `/${testEntity.id}/posts`)
            .auth('admin', 'qwerty')
            .send(getPostDtoWithoutBlogId())
            .expect(HttpResponceCodes.CREATED_201);
        
        expect(createResponce.body).toEqual({
            id: expect.any(String),
            title: createResponce.body.title,
            shortDescription: createResponce.body.shortDescription,
            content: createResponce.body.content,
            blogId: testEntity.id,
            blogName: testEntity.name,
            createdAt: expect.any(String),
        });

        await request(app)
            .get(BLOGS_PATH + `/${testEntity.id}/posts`)
            .expect(HttpResponceCodes.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items:[
                    {...createResponce.body},
                    {...createEntity2},
                    {...createEntity1},
            ]});
    });

    it('should update entity with correct input data, 201', async () => {
        const testEntities1 = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);
        const testEntities2 = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);        

        const updateBlogDto = { name: 'updatedname', description: 'updatednamedescription',  websiteUrl: 'https://updatedgoogle1mail.ru' }

        await request(app)
            .put(BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send(getBlogDto(updateBlogDto))
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items:[
                {...testEntities2},
                {...testEntities1},
                { ...testEntity, ...updateBlogDto }
            ]});
    });

    it('should delete entity with correct  id, 201', async () => {
        await request(app)
            .delete(BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(BLOGS_PATH + `/${testEntity.id}`).expect(HttpResponceCodes.NOT_FOUND_404);
        
        const response = await request(app)
            .get(BLOGS_PATH)
            .expect(HttpResponceCodes.OK_200);

            expect(response.body.items).toBeInstanceOf(Array);
            expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    });

    afterAll((done) => {
        done();  
    })
});