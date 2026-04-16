import request from 'supertest';
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

    it('should return Unauthorized by invalid token', async () => {
        await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${'refreshToken'}`])
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401)

        await request(app)
            .delete(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${'refreshTokenBydevice2'}`])
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401)

        const result = await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.OK_200)

        await request(app)
            .delete(SECURITY_DEVICES_PATH + `/${result.body[0].deviceId}`)
            .set('Cookie', [`refreshToken=${'refreshTokenBydevice3'}`])
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401)
    });

    it('should return not gound by invalid device id', async () => {
        await request(app)
            .delete(SECURITY_DEVICES_PATH + `/1111111`)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.NOT_FOUND_404)
    });

      it('should return 403 If try to delete the deviceId of other user', async () => {
        const user2Dto = {login: 'login2', password: 'password2', email: 'email2@mail.ru'};
        const user2 = await createUser(app, user2Dto, HttpResponceCodes.CREATED_201);
            const headersDevice2 = {
                'X-Forwarded-For': '::43',
                'User-Agent': 'device2', 
            };

        const loginDevice2 = await request(app)
            .post(AUTH_PATH + '/login')
            .set(headersDevice2)
            .send({loginOrEmail: user2.login, password: user2Dto.password})
            .expect(HttpResponceCodes.OK_200);

        const cookies2 = loginDevice2.header['set-cookie'];
        const subCookies2 = Array.from(cookies2).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice2 = subCookies2?.split(';')[0].split('=')[1] || '';

        const result = await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.OK_200);

        await request(app)
            .delete(SECURITY_DEVICES_PATH + `/${result.body[0].deviceId}`)
            .set('Cookie', [`refreshToken=${refreshTokenBydevice2}`])
            .expect(HttpResponceCodes.FORBIDDEN_403)

        expect(result.body).toEqual([
            {
                ip: headers['X-Forwarded-For'],
                title: headers['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            }
        ]);

        const result2 = await request(app)
            .get(SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshTokenBydevice2}`])
            .expect(HttpResponceCodes.OK_200);

        expect(result2.body).toEqual([
            {
                ip: headersDevice2['X-Forwarded-For'],
                title: headersDevice2['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            }
        ]);
    });
});