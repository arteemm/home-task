import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { HttpResponceCodes } from '../src/core/types/responseCodes'; 
import { AvailableResolutions, Video, CreateVideo, ChangeVideo } from '../src/videos/types/video';
import { API_ERRORS } from '../src/core/constants/apiErrors'


const videoObjCreate: CreateVideo = {
    title: 'test',
    author: 'lol',
    availableResolutions: [
        AvailableResolutions.P144
    ]
};

const videoObjUpdate: ChangeVideo = {
    title: 'newTitle',
    author: 'newAuthor',
    availableResolutions: [
        AvailableResolutions.P1440,
        AvailableResolutions.P360,
    ],
    canBeDownloaded: true,
    minAgeRestriction: 18,
    publicationDate: '2026-01-24T19:18:58.465Z',
};

let id: number = 1;
 
describe('/videos', () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get('/videos')
        .expect(HttpResponceCodes.OK_200, [])
    });

    it('shouldn\'t create video with incorrect input data', async () => {
        await request(app)
        .post('/videos')
        .send({ title: 5, author: 4, availableResolutions: '' })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.author.NOT_A_STRING, API_ERRORS.title.NOT_A_STRING, API_ERRORS.availableResolutions.NOT_ARRAY ]
        })
    });

    it('shouldn\'t create video with incorrect input data', async () => {
        await request(app)
        .post('/videos')
        .send({ title: 5, author: 4 })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.author.NOT_A_STRING, API_ERRORS.title.NOT_A_STRING, API_ERRORS.availableResolutions.NOT_ARRAY ]
        })
    });

    it('shouldn\'t create video with incorrect input data', async () => {
        await request(app)
        .post('/videos')
        .send({})
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [ API_ERRORS.author.NOT_FIND, API_ERRORS.title.NOT_FIND, API_ERRORS.availableResolutions.NOT_ARRAY ]
        })
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get('/videos')
        .expect(HttpResponceCodes.OK_200, [])
    });

    it('should create video with correct input data', async () => {
        const createResponce = await request(app)
        .post('/videos')
        .send(videoObjCreate)
        .expect(HttpResponceCodes.CREATED_201);

        const createdVideo: Video = createResponce.body;
        id = createdVideo.id;
        
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: videoObjCreate.title,
            author: videoObjCreate.author,
            canBeDownloaded: expect.any(Boolean),
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: videoObjCreate.availableResolutions,
        });
    });

    it('should return 200 and array with correct data', async () => {
        const createResponce =  await request(app)
        .get('/videos')
        .expect(HttpResponceCodes.OK_200);

        const videosAray: Video[] = createResponce.body;
        expect(videosAray).toEqual([
                {
                id: expect.any(Number),
                title: videoObjCreate.title,
                author: videoObjCreate.author,
                canBeDownloaded: expect.any(Boolean),
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: videoObjCreate.availableResolutions,
            }]
        );
    });

    it('should return 200 and obj by id with correct data', async () => {
        const createResponce =  await request(app)
        .get(`/videos/${id}`)
        .expect(HttpResponceCodes.OK_200);

        const videosAray: Video[] = createResponce.body;
        expect(videosAray).toEqual({
                id: expect.any(Number),
                title: videoObjCreate.title,
                author: videoObjCreate.author,
                canBeDownloaded: expect.any(Boolean),
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: videoObjCreate.availableResolutions,
            });
    });
    
    it('should return 404 by incorect id', async () => {
        await request(app)
        .get(`/videos/999`)
        .expect(HttpResponceCodes.NOT_FOUND_404);
    });

    it('shouldn\'t update video with incorrect input data', async () => {
        await request(app)
        .put(`/videos/${id}`)
        .send({ title: 'ss', author: '4', availableResolutions: 'yes', canBeDownloaded: 'no', minAgeRestriction: 'd', publicationDate: 23 })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [
                API_ERRORS.availableResolutions.NOT_ARRAY,
                API_ERRORS.canBeDownloaded.NOT_A_BOOLEAN,
                API_ERRORS.publicationDate.NOT_A_STRING,
                API_ERRORS.minAgeRestriction.NOT_A_NUMBER,
             ]
        })
    });

    it('shouldn\'t update video with incorrect input data', async () => {
        await request(app)
        .put(`/videos/${id}`)
        .send({ title: '5', author: '4', availableResolutions: [AvailableResolutions.P1440] })
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [
                API_ERRORS.canBeDownloaded.NOT_FIND,
                API_ERRORS.publicationDate.NOT_FIND,
             ]
        })
    });

    it('shouldn\'t update video without data', async () => {
        await request(app)
        .put(`/videos/${id}`)
        .send({})
        .expect(HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [
                API_ERRORS.author.NOT_FIND,
                API_ERRORS.title.NOT_FIND,
                API_ERRORS.availableResolutions.NOT_ARRAY,
                API_ERRORS.canBeDownloaded.NOT_FIND,
                API_ERRORS.publicationDate.NOT_FIND,
             ]
        })
    });

    it('should return 200 and obj by id with correct data', async () => {
        const createResponce =  await request(app)
        .get(`/videos/${id}`)
        .expect(HttpResponceCodes.OK_200);

        const videosAray: Video[] = createResponce.body;
        expect(videosAray).toEqual({
                id: expect.any(Number),
                title: videoObjCreate.title,
                author: videoObjCreate.author,
                canBeDownloaded: expect.any(Boolean),
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: videoObjCreate.availableResolutions,
            });
    });

    it('should update video with correct input data', async () => {
        await request(app)
        .put(`/videos/${id}`)
        .send(videoObjUpdate)
        .expect(HttpResponceCodes.NO_CONTENT_204);
    });

    it('should return 404 by incorect id', async () => {
        await request(app)
        .put(`/videos/999`)
        .expect(HttpResponceCodes.NOT_FOUND_404);
    });

    it('should return 200 and array with correct data', async () => {
        const createResponce =  await request(app)
        .get('/videos')
        .expect(HttpResponceCodes.OK_200);

        const videosAray: Video[] = createResponce.body;
        expect(videosAray).toEqual([
                {
                id: expect.any(Number),
                title: videoObjUpdate.title,
                author: videoObjUpdate.author,
                canBeDownloaded: videoObjUpdate.canBeDownloaded,
                minAgeRestriction: videoObjUpdate.minAgeRestriction,
                createdAt: expect.any(String),
                publicationDate: videoObjUpdate.publicationDate,
                availableResolutions: videoObjUpdate.availableResolutions,
            }]
        );
    });

    it('should return 404 by incorect id', async () => {
        await request(app)
        .delete(`/videos/999`)
        .expect(HttpResponceCodes.NOT_FOUND_404);
    });

    it('should delete video by id and return 204', async () => {
        await request(app)
        .delete(`/videos/${id}`)
        .expect(HttpResponceCodes.NO_CONTENT_204);
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get('/videos')
        .expect(HttpResponceCodes.OK_200, [])
    });
    
});