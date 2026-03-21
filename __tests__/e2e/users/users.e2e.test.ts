import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { USER_PATH, TESTING_PATH, AUTH_PATH } from '../../../src/core/constants/paths';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createUser } from '../../utils/users/create-user';


jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-v4',
  // mock other exports as needed
}));

 
describe(USER_PATH, () => {
    const app = express();
    setupApp(app);

    let testEntity: UserViewModel = {} as UserViewModel;
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('should return 200 and empty array', async () => {
        await request(app)
        .get(USER_PATH)
        .auth('admin', 'qwerty')
        .expect(HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    });

    it('should create user with correct input data, 201', async () => {
        const createResponce = await createUser(app, getUserDto(), HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);

        await request(app)
            .get(USER_PATH)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{ ...createResponce }] });
    });

    it('should delete entity with correct  id, 204', async () => {
        const createResponce = await createUser(app, getUserDto({login: 'uniLogin1', email: 'UniqueEmail1@mail.ru'}), HttpResponceCodes.CREATED_201);

        await request(app)
            .delete(USER_PATH + `/${createResponce.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.NO_CONTENT_204);

        await request(app)
            .get(USER_PATH)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{ ...testEntity }] });
    });

    it('should login entity with correct login and password, 204', async () => {
        const user = getUserDto({login: 'uniLogin2', email: 'UniqueEmail2@mail.ru'});

        await request(app)
            .post(AUTH_PATH + '/login')
            .send({loginOrEmail: testEntity.login, password: user.password})
            .expect(HttpResponceCodes.OK_200);
           
        const responce = await request(app)
            .post(AUTH_PATH + '/login')
            .send({loginOrEmail: testEntity.email, password: user.password})
            .expect(HttpResponceCodes.OK_200);

        accessToken = responce.body.accessToken;
        const cookies = responce.header['set-cookie'];
        const subCookies = Array.from(cookies).find(str => str.split('=')[0] === 'refreshToken');
        refreshToken = subCookies?.split(';')[0].split('=')[1] || '';
    });

    it('should return 200 and user logined params', async () => {
        await request(app)
        .get(AUTH_PATH + '/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpResponceCodes.OK_200, { email: testEntity.email, login: testEntity.login, userId: testEntity.id })
    });

    it('should return 200 and user logined params', async () => {
        console.log('old',refreshToken);
        const responce = await request(app)
        .post(AUTH_PATH + '/refresh-token')
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .expect(HttpResponceCodes.OK_200);

        expect(responce.body).toStrictEqual({accessToken: expect.any(String)});
        expect(responce.header['set-cookie']).not.toBeUndefined();
        expect(responce.header['set-cookie']).not.toBeNull();

        accessToken = responce.body.accessToken;
        const cookies = responce.header['set-cookie'];
        const subCookies = Array.from(cookies).find(str => str.split('=')[0] === 'refreshToken');
        refreshToken = subCookies?.split(';')[0].split('=')[1] || '';
        console.log('new',refreshToken);
    });

    it('should logout user and check that user is logout', async () => {
        await request(app)
            .post(AUTH_PATH + '/logout')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.NO_CONTENT_204);

        await request(app)
            .post(AUTH_PATH + '/logout')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .post(AUTH_PATH + '/refresh-token')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
    });


    afterAll((done) => {
        done();  
    })
});