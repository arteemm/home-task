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
    let user = {};
    let accessToken;
    let refreshToken;
    let refreshTokenBydevice2;
    let refreshTokenBydevice3;
    let headers = {
        'X-Forwarded-For': '::4',
        'User-Agent': 'customUserAgent',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoURI);
        yield (0, supertest_1.default)(app).delete(paths_1.TESTING_PATH);
        const createResponce = yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        user = structuredClone(createResponce);
        const responce = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .set(headers)
            .send({ loginOrEmail: user.login, password: (0, get_user_dto_1.getUserDto)().password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        accessToken = responce.body.accessToken;
        const cookies = responce.header['set-cookie'];
        const subCookies = Array.from(cookies).find(str => str.split('=')[0] === 'refreshToken');
        refreshToken = (subCookies === null || subCookies === void 0 ? void 0 : subCookies.split(';')[0].split('=')[1]) || '';
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(app)
            .get(paths_1.SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        expect(result.body).toEqual([{
                ip: headers['X-Forwarded-For'],
                title: headers['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            }]);
    }));
    it('should delete all sessions except device id', () => __awaiter(void 0, void 0, void 0, function* () {
        const headersDevice2 = {
            'X-Forwarded-For': '::2',
            'User-Agent': 'device2',
        };
        const headersdevice3 = {
            'X-Forwarded-For': '::5',
            'User-Agent': 'device2',
        };
        const loginDevice2 = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .set(headersDevice2)
            .send({ loginOrEmail: user.login, password: (0, get_user_dto_1.getUserDto)().password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        const cookies2 = loginDevice2.header['set-cookie'];
        const subCookies2 = Array.from(cookies2).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice2 = (subCookies2 === null || subCookies2 === void 0 ? void 0 : subCookies2.split(';')[0].split('=')[1]) || '';
        const loginDevice3 = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .set(headersdevice3)
            .send({ loginOrEmail: user.login, password: (0, get_user_dto_1.getUserDto)().password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        const cookies3 = loginDevice3.header['set-cookie'];
        const subCookies3 = Array.from(cookies3).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice3 = (subCookies3 === null || subCookies3 === void 0 ? void 0 : subCookies3.split(';')[0].split('=')[1]) || '';
        const result = yield (0, supertest_1.default)(app)
            .get(paths_1.SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
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
        yield (0, supertest_1.default)(app)
            .delete(paths_1.SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshTokenBydevice2}`])
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        const result2 = yield (0, supertest_1.default)(app)
            .get(paths_1.SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        expect(result2.body).toEqual([
            {
                ip: headersDevice2['X-Forwarded-For'],
                title: headersDevice2['User-Agent'],
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
        ]);
        headers['User-Agent'] = headersDevice2['User-Agent'];
        headers['X-Forwarded-For'] = headersDevice2['X-Forwarded-For'];
    }));
    it('should delete one session by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const headersDevice2 = {
            'X-Forwarded-For': '::43',
            'User-Agent': 'device2',
        };
        const headersdevice3 = {
            'X-Forwarded-For': '::55',
            'User-Agent': 'device2',
        };
        const loginDevice2 = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .set(headersDevice2)
            .send({ loginOrEmail: user.login, password: (0, get_user_dto_1.getUserDto)().password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        const cookies2 = loginDevice2.header['set-cookie'];
        const subCookies2 = Array.from(cookies2).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice2 = (subCookies2 === null || subCookies2 === void 0 ? void 0 : subCookies2.split(';')[0].split('=')[1]) || '';
        const loginDevice3 = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/login')
            .set(headersdevice3)
            .send({ loginOrEmail: user.login, password: (0, get_user_dto_1.getUserDto)().password })
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        const cookies3 = loginDevice3.header['set-cookie'];
        const subCookies3 = Array.from(cookies3).find(str => str.split('=')[0] === 'refreshToken');
        refreshTokenBydevice3 = (subCookies3 === null || subCookies3 === void 0 ? void 0 : subCookies3.split(';')[0].split('=')[1]) || '';
        const result = yield (0, supertest_1.default)(app)
            .get(paths_1.SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
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
        yield (0, supertest_1.default)(app)
            .delete(paths_1.SECURITY_DEVICES_PATH + `/${result.body[2].deviceId}`)
            .set('Cookie', [`refreshToken=${refreshTokenBydevice3}`])
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        const result2 = yield (0, supertest_1.default)(app)
            .get(paths_1.SECURITY_DEVICES_PATH)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
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
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
});
