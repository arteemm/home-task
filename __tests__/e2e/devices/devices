import request from 'supertest';
import express from 'express';
import { app } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { USER_PATH, TESTING_PATH, AUTH_PATH, SECURITY_DEVICES_PATH } from '../../../src/core/constants/paths';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUser } from '../../utils/users/create-user';
import mongoose from 'mongoose';
 
describe(USER_PATH, () => {
    const PORT = 5002;
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let server: any;

    let user: UserViewModel = {} as UserViewModel;
    let accessToken: string;
    let refreshToken: string;
    let refreshTokenBydevice2: string;
    let refreshTokenBydevice3: string;
    let headers = {
        'X-Forwarded-For': '::4',
        'User-Agent': 'customUserAgent', 
    };

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
        await request(app).delete(TESTING_PATH);
        const createResponce = await createUser(app, getUserDto(), HttpResponceCodes.CREATED_201);
        user = structuredClone(createResponce);

        const responce = await request(app)
            .post(AUTH_PATH + '/login')
            .set(headers)
            .send({loginOrEmail: user.login, password: getUserDto().password})
            .expect(HttpResponceCodes.OK_200);

        accessToken = responce.body.accessToken;
        const cookies = responce.header['set-cookie'];
        const subCookies = Array.from(cookies).find(str => str.split('=')[0] === 'refreshToken');
        refreshToken = subCookies?.split(';')[0].split('=')[1] || '';
    });

    afterAll(async () => {
        await mongoose.connection.close();
        if (server) {
            server.close();
        }
    });

    it('should return 200 and empty array', async () => {
        const result = await request(app)
        .get(SECURITY_DEVICES_PATH)
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .expect(HttpResponceCodes.OK_200)

        expect(result.body).toEqual([{
            ip: headers['X-Forwarded-For'],
            title: headers['User-Agent'],
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
        }]);
    });

    it('should delete all sessions except device id', async () => {
            const headersDevice2 = {
                'X-Forwarded-For': '::2',
                'User-Agent': 'device2', 
            };

            const headersdevice3 = {
                'X-Forwarded-For': '::5',
                'User-Agent': 'device2', 
            };
        const loginDevice2 = await request(app)
            .post(AUTH_PATH + '/login')
            .set(headersDevice2)
            .send({loginOrEmail: user.login, password: getUserDto().password})
            .expect(HttpResponceCodes.OK_200);

        const cookies2 = loginDevice2.header['set-cookie'];
        const subCookies2 = Array.from(cookies2).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice2 = subCookies2?.split(';')[0].split('=')[1] || '';

        
        const loginDevice3 = await request(app)
            .post(AUTH_PATH + '/login')
            .set(headersdevice3)
            .send({loginOrEmail: user.login, password: getUserDto().password})
            .expect(HttpResponceCodes.OK_200);

        const cookies3 = loginDevice3.header['set-cookie'];
        const subCookies3 = Array.from(cookies3).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice3 = subCookies3?.split(';')[0].split('=')[1] || '';

        const result = await request(app)
        .get(SECURITY_DEVICES_PATH)
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .expect(HttpResponceCodes.OK_200)

        expect(result.body).toEqual([
            {
                ip: headers['X-Forwarded-For'],
                title: headers['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: headersDevice2['X-Forwarded-For'],
                title: headersDevice2['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: headersdevice3['X-Forwarded-For'],
                title: headersdevice3['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
        ]);

        await request(app)
            .delete(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshTokenBydevice2}`])
            .expect(HttpResponceCodes.NO_CONTENT_204)

        const result2 = await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.OK_200)

        
        expect(result2.body).toEqual([
            {
                ip: headersDevice2['X-Forwarded-For'],
                title: headersDevice2['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
        ]);

        headers['User-Agent'] = headersDevice2['User-Agent'] ;
        headers['X-Forwarded-For'] = headersDevice2['X-Forwarded-For'];
    });

      it('should delete one session by id', async () => {
            const headersDevice2 = {
                'X-Forwarded-For': '::43',
                'User-Agent': 'device2', 
            };

            const headersdevice3 = {
                'X-Forwarded-For': '::55',
                'User-Agent': 'device2', 
            };
        const loginDevice2 = await request(app)
            .post(AUTH_PATH + '/login')
            .set(headersDevice2)
            .send({loginOrEmail: user.login, password: getUserDto().password})
            .expect(HttpResponceCodes.OK_200);

        const cookies2 = loginDevice2.header['set-cookie'];
        const subCookies2 = Array.from(cookies2).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice2 = subCookies2?.split(';')[0].split('=')[1] || '';

        
        const loginDevice3 = await request(app)
            .post(AUTH_PATH + '/login')
            .set(headersdevice3)
            .send({loginOrEmail: user.login, password: getUserDto().password})
            .expect(HttpResponceCodes.OK_200);

        const cookies3 = loginDevice3.header['set-cookie'];
        const subCookies3 = Array.from(cookies3).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice3 = subCookies3?.split(';')[0].split('=')[1] || '';

        const result = await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.OK_200)

        expect(result.body).toEqual([
            {
                ip: headers['X-Forwarded-For'],
                title: headers['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: headersDevice2['X-Forwarded-For'],
                title: headersDevice2['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: headersdevice3['X-Forwarded-For'],
                title: headersdevice3['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
        ]);

        await request(app)
            .delete(SECURITY_DEVICES_PATH + `/${result.body[2].deviceId}`)
            .set('Cookie', [`refreshToken=${refreshTokenBydevice3}`])
            .expect(HttpResponceCodes.NO_CONTENT_204)

        const result2 = await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.OK_200)

        
        expect(result2.body).toEqual([
            {
                ip: headers['X-Forwarded-For'],
                title: headers['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: headersDevice2['X-Forwarded-For'],
                title: headersDevice2['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
        ]);
    });
});