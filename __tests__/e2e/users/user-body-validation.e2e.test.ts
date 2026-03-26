import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes';
import { CreateUserDto } from '../../../src/users/types/create-user-dto';
import { API_ERRORS } from '../../../src/core/constants/apiErrors';
import { TESTING_PATH, USER_PATH, AUTH_PATH } from '../../../src/core/constants/paths';
import { createUser } from '../../utils/users/create-user';
import { getUserDto } from '../../utils/users/get-user-dto';
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { loginUser } from '../../utils/users/login-user';
import { client } from '../../../src/repositories/db';


describe('User API body validation check', () => {
    const app = express();
    setupApp(app);

    let testEntity: UserViewModel = {} as UserViewModel;

    beforeAll(async () => {
        await request(app).delete(TESTING_PATH);
    });

    it('shouldn\'t login user with incorrect input data, 400', async () => {
        const createResponce = await createUser(app, getUserDto(), HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);

        await loginUser(
            app,
            {loginOrEmail: 'ttt', password: 'ttt'},
            HttpResponceCodes.NOT_AUTHORIZED_401,
        );

        await loginUser(
            app,
            {loginOrEmail: testEntity.login, password: 'ttt'},
            HttpResponceCodes.NOT_AUTHORIZED_401,
        );

        await loginUser(
            app,
            {loginOrEmail: 444, password: ''},
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.loginOrEmail.NOT_A_STRING,  API_ERRORS.password.NOT_FIND ]
        );
    });


    it('shouldn\'t create user with ununique login or email , 400', async () => {
        const createUserDto: CreateUserDto = {
            login: 'testLogin',
            password: '1234567',
            email: 'testemail@mail.ru'
        };

        const createResponce = await createUser(app, getUserDto(createUserDto), HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);

        await createUser(
            app,
            getUserDto({...createUserDto, email: 'lolololo@mail.ru'}),
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.login.MUST_BE_UNIQUE ]
        );
        
        await createUser(
            app,
            getUserDto({...createUserDto, login: 'lololo'}),
            HttpResponceCodes.BAD_REQUEST_400,
            [ API_ERRORS.email.MUST_BE_UNIQUE ]
        );

        const response = await request(app)
            .get(USER_PATH)
            .auth('admin', 'qwerty')
            .expect(HttpResponceCodes.OK_200);

        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    });

    it('shouldn\'t authorization with incorrect login or password, 401', async () => {
        await request(app)
            .post(USER_PATH)
            .auth('admin1', 'qwerty2')
            .send(getUserDto())
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .delete(USER_PATH + `/${testEntity.id}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);

        await request(app)
            .get(AUTH_PATH + '/me')
            .set('Authorization', `Bearer ${'asdasda.123123.dsadsa'}`)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
        
        await request(app)
            .get(USER_PATH)
            .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
    });

    it('should return Unauthorized if refreshtoken is incorrect', async () => {
        const responce = await request(app)
        .post(AUTH_PATH + '/refresh-token')
        .set('Cookie', [`refreshToken=${'refreshToken'}`])
        .expect(HttpResponceCodes.NOT_AUTHORIZED_401);
    });

    afterAll(async () => {
        await client.close();
    })
});