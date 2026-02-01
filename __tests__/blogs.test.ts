import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { HttpResponceCodes } from '../src/core/types/responseCodes'; 
import { Blog, CreateBlog, ChangeBlog } from '../src/blogs/types/blogs';
import { API_ERRORS } from '../src/core/constants/apiErrors';
import { BLOGS_PATH, TESTING_PATH } from '../src/core/constants/paths';


const videoObjCreate: CreateBlog = {
    name: 'test',
    description: 'lol',
    websiteUrl: 'google'
};

const videoObjUpdate: ChangeBlog = {
    name: 'name',
    description: 'description',
    websiteUrl: 'zalupa'
};

let id: number = 1;
 
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

    it('shouldn\'t create video with incorrect input data', async () => {
        await request(app)
        .post(BLOGS_PATH)
        .send({ title: 5, author: 4, availableResolutions: '' })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.author.NOT_A_STRING, API_ERRORS.title.NOT_A_STRING, API_ERRORS.availableResolutions.NOT_ARRAY ]
        })
    });

    // it('shouldn\'t create video with incorrect input data', async () => {
    //     await request(app)
    //     .post(BLOGS_PATH)
    //     .send({ title: 5, author: 4 })
    //     .expect(HttpResponceCodes.BAD_REQUEST_400, {
    //         errorsMessages: [ API_ERRORS.author.NOT_A_STRING, API_ERRORS.title.NOT_A_STRING, API_ERRORS.availableResolutions.NOT_ARRAY ]
    //     })
    // });

    // it('shouldn\'t create video with incorrect input data', async () => {
    //     await request(app)
    //     .post(BLOGS_PATH)
    //     .send({})
    //     .expect(HttpResponceCodes.BAD_REQUEST_400, {
    //         errorsMessages: [ API_ERRORS.author.NOT_FIND, API_ERRORS.title.NOT_FIND, API_ERRORS.availableResolutions.NOT_ARRAY ]
    //     })
    // });

    // it('should return 200 and empty array', async () => {
    //     await request(app)
    //     .get(BLOGS_PATH)
    //     .expect(HttpResponceCodes.OK_200, [])
    // });

    // it('should create video with correct input data', async () => {
    //     const createResponce = await request(app)
    //     .post(BLOGS_PATH)
    //     .send(videoObjCreate)
    //     .expect(HttpResponceCodes.CREATED_201);

    //     const createdVideo: Blog = createResponce.body;
    //     id = createdVideo.id;
        
    //     expect(createdVideo).toEqual({
    //         id: expect.any(Number),
    //         title: videoObjCreate.title,
    //         author: videoObjCreate.author,
    //         canBeDownloaded: expect.any(Boolean),
    //         minAgeRestriction: null,
    //         createdAt: expect.any(String),
    //         publicationDate: expect.any(String),
    //         availableResolutions: videoObjCreate.availableResolutions,
    //     });
    // });

    // it('should return 200 and array with correct data', async () => {
    //     const createResponce =  await request(app)
    //     .get(BLOGS_PATH)
    //     .expect(HttpResponceCodes.OK_200);

    //     const videosAray: Video[] = createResponce.body;
    //     expect(videosAray).toEqual([
    //             {
    //             id: expect.any(Number),
    //             title: videoObjCreate.title,
    //             author: videoObjCreate.author,
    //             canBeDownloaded: expect.any(Boolean),
    //             minAgeRestriction: null,
    //             createdAt: expect.any(String),
    //             publicationDate: expect.any(String),
    //             availableResolutions: videoObjCreate.availableResolutions,
    //         }]
    //     );
    // });

    // it('should return 200 and obj by id with correct data', async () => {
    //     const createResponce =  await request(app)
    //     .get(BLOGS_PATH + id)
    //     .expect(HttpResponceCodes.OK_200);

    //     const videosAray: Video[] = createResponce.body;
    //     expect(videosAray).toEqual({
    //             id: expect.any(Number),
    //             title: videoObjCreate.title,
    //             author: videoObjCreate.author,
    //             canBeDownloaded: expect.any(Boolean),
    //             minAgeRestriction: null,
    //             createdAt: expect.any(String),
    //             publicationDate: expect.any(String),
    //             availableResolutions: videoObjCreate.availableResolutions,
    //         });
    // });
    
    // it('should return 404 by incorect id', async () => {
    //     await request(app)
    //     .get(`${BLOGS_PATH}999`)
    //     .expect(HttpResponceCodes.NOT_FOUND_404);
    // });

    // it('shouldn\'t update video with incorrect input data', async () => {
    //     await request(app)
    //     .put(BLOGS_PATH + id)
    //     .send({ title: 'ss', author: '4', availableResolutions: 'yes', canBeDownloaded: 'no', minAgeRestriction: 'd', publicationDate: 23 })
    //     .expect(HttpResponceCodes.BAD_REQUEST_400, {
    //         errorsMessages: [
    //             API_ERRORS.availableResolutions.NOT_ARRAY,
    //             API_ERRORS.canBeDownloaded.NOT_A_BOOLEAN,
    //             API_ERRORS.publicationDate.NOT_A_STRING,
    //             API_ERRORS.minAgeRestriction.NOT_A_NUMBER,
    //          ]
    //     })
    // });

    // it('shouldn\'t update video with incorrect input data', async () => {
    //     await request(app)
    //     .put(BLOGS_PATH + id)
    //     .send({ title: '5', author: '4', availableResolutions: [AvailableResolutions.P1440] })
    //     .expect(HttpResponceCodes.BAD_REQUEST_400, {
    //         errorsMessages: [
    //             API_ERRORS.canBeDownloaded.NOT_FIND,
    //             API_ERRORS.publicationDate.NOT_FIND,
    //          ]
    //     })
    // });

    // it('shouldn\'t update video without data', async () => {
    //     await request(app)
    //     .put(BLOGS_PATH+ id)
    //     .send({})
    //     .expect(HttpResponceCodes.BAD_REQUEST_400, {
    //         errorsMessages: [
    //             API_ERRORS.author.NOT_FIND,
    //             API_ERRORS.title.NOT_FIND,
    //             API_ERRORS.availableResolutions.NOT_ARRAY,
    //             API_ERRORS.canBeDownloaded.NOT_FIND,
    //             API_ERRORS.publicationDate.NOT_FIND,
    //          ]
    //     })
    // });

    // it('should return 200 and obj by id with correct data', async () => {
    //     const createResponce =  await request(app)
    //     .get(BLOGS_PATH + id)
    //     .expect(HttpResponceCodes.OK_200);

    //     const videosAray: Video[] = createResponce.body;
    //     expect(videosAray).toEqual({
    //             id: expect.any(Number),
    //             title: videoObjCreate.title,
    //             author: videoObjCreate.author,
    //             canBeDownloaded: expect.any(Boolean),
    //             minAgeRestriction: null,
    //             createdAt: expect.any(String),
    //             publicationDate: expect.any(String),
    //             availableResolutions: videoObjCreate.availableResolutions,
    //         });
    // });

    // it('should update video with correct input data', async () => {
    //     await request(app)
    //     .put(BLOGS_PATH + id)
    //     .send(videoObjUpdate)
    //     .expect(HttpResponceCodes.NO_CONTENT_204);
    // });

    // it('should return 404 by incorect id', async () => {
    //     await request(app)
    //     .put(`${BLOGS_PATH}/999`)
    //     .expect(HttpResponceCodes.NOT_FOUND_404);
    // });

    // it('should return 200 and array with correct data', async () => {
    //     const createResponce =  await request(app)
    //     .get(BLOGS_PATH)
    //     .expect(HttpResponceCodes.OK_200);

    //     const videosAray: Blog[] = createResponce.body;
    //     expect(videosAray).toEqual([
    //             {
    //             id: expect.any(Number),
    //             title: videoObjUpdate.title,
    //             author: videoObjUpdate.author,
    //             canBeDownloaded: videoObjUpdate.canBeDownloaded,
    //             minAgeRestriction: videoObjUpdate.minAgeRestriction,
    //             createdAt: expect.any(String),
    //             publicationDate: videoObjUpdate.publicationDate,
    //             availableResolutions: videoObjUpdate.availableResolutions,
    //         }]
    //     );
    // });

    // it('should return 404 by incorect id', async () => {
    //     await request(app)
    //     .delete(`${BLOGS_PATH}/999`)
    //     .expect(HttpResponceCodes.NOT_FOUND_404);
    // });

    // it('should delete video by id and return 204', async () => {
    //     await request(app)
    //     .delete(BLOGS_PATH + id)
    //     .expect(HttpResponceCodes.NO_CONTENT_204);
    // });

    // it('should return 200 and empty array', async () => {
    //     await request(app)
    //     .get(BLOGS_PATH)
    //     .expect(HttpResponceCodes.OK_200, [])
    // });
    
});