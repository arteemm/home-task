"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("../../../src/setup-app");
const responseCodes_1 = require("../../../src/core/constants/responseCodes");
const paths_1 = require("../../../src/core/constants/paths");
const get_user_dto_1 = require("../../utils/users/get-user-dto");
const create_user_1 = require("../../utils/users/create-user");
const mongoose_1 = __importDefault(require("mongoose"));
describe(paths_1.USER_PATH, () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let testEntity = {};
    let accessToken;
    let refreshToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoURI);
        yield (0, supertest_1.default)(app).delete(paths_1.TESTING_PATH);
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get(paths_1.USER_PATH)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    }));
    it('should create user with correct input data, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponce = yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);
        yield (0, supertest_1.default)(app)
            .get(paths_1.USER_PATH)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [Object.assign({}, createResponce)] });
    }));
    it('should delete entity with correct  id, 204', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponce = yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)({ login: 'uniLogin1', email: 'UniqueEmail1@mail.ru' }), responseCodes_1.HttpResponceCodes.CREATED_201);
        yield (0, supertest_1.default)(app)
            .delete(paths_1.USER_PATH + `/${createResponce.id}`)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        yield (0, supertest_1.default)(app)
            .get(paths_1.USER_PATH)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [Object.assign({}, testEntity)] });
    }));
    it('should login entity with correct login and password, 204', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = (0, get_user_dto_1.getUserDto)({ login: 'uniLogin2', email: 'UniqueEmail2@mail.ru' });
        yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .send({ loginOrEmail: testEntity.login, password: user.password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        const responce = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .send({ loginOrEmail: testEntity.email, password: user.password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        accessToken = responce.body.accessToken;
        const cookies = responce.header['set-cookie'];
        const subCookies = Array.from(cookies).find(str => str.split('=')[0] === 'refreshToken');
        refreshToken = (subCookies === null || subCookies === void 0 ? void 0 : subCookies.split(';')[0].split('=')[1]) || '';
    }));
    it('should return 200 and user logined params', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get(paths_1.AUTH_PATH + '/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { email: testEntity.email, login: testEntity.login, userId: testEntity.id });
    }));
    it('should return 200 and user logined params', () => __awaiter(void 0, void 0, void 0, function* () {
        const responce = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/refresh-token')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        expect(responce.body).toStrictEqual({ accessToken: expect.any(String) });
        expect(responce.header['set-cookie']).not.toBeUndefined();
        expect(responce.header['set-cookie']).not.toBeNull();
        accessToken = responce.body.accessToken;
        const cookies = responce.header['set-cookie'];
        const subCookies = Array.from(cookies).find(str => str.split('=')[0] === 'refreshToken');
        refreshToken = (subCookies === null || subCookies === void 0 ? void 0 : subCookies.split(';')[0].split('=')[1]) || '';
    }));
    it('should logout user and check that user is logout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/logout')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/logout')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/refresh-token')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
});
