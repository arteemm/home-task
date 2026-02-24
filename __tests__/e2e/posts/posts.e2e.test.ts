import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { PostViewModel } from '../../../src/posts/types/posts';
import { TESTING_PATH, POSTS_PATH } from '../../../src/core/constants/paths';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';

 
describe(POSTS_PATH, () => {
    const app = express();
    setupApp(app);

    let testEntity: PostViewModel = {} as PostViewModel;
    let testBlogId: string = '';

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get(POSTS_PATH)
        .expect(HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    });

    it('should create entity with correct input data, 201', async () => {
        const createBlod = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);
        testBlogId = createBlod.id;

        const createResponce = await createPost(app, getPostDto({ blogId: testBlogId }), HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);

        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{ ...createResponce }] });
    });

      it('should update entity with correct input data, 201', async () => {
        const testEntities1 = await createPost(app, getPostDto({ blogId: testBlogId }), HttpResponceCodes.CREATED_201);
        const testEntities2 = await createPost(app, getPostDto({ blogId: testBlogId }), HttpResponceCodes.CREATED_201);        

        const updateEntityDto = { title: 'updated1', shortDescription: 'updated1', content: 'https://updated1.ru', blogId: testBlogId }

        await request(app)
            .put(POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send(getPostDto(updateEntityDto))
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items:[
                {...testEntities2},
                {...testEntities1},
                { ...testEntity, ...updateEntityDto }
            ]});
    });

    it('should delete entity with correct  id, 201', async () => {
        await request(app)
            .delete(POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NO_CONTENT_204);
        
        await request(app)
            .get(POSTS_PATH + `/${testEntity.id}`).expect(HttpResponceCodes.NOT_FOUND_404);
        
        const response = await request(app)
            .get(POSTS_PATH)
            .expect(HttpResponceCodes.OK_200);

            expect(response.body.items).toBeInstanceOf(Array);
            expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    });

    afterAll((done) => {
        done();  
    })
});