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
const apiErrors_1 = require("../../../src/core/constants/apiErrors");
const paths_1 = require("../../../src/core/constants/paths");
const create_user_1 = require("../../utils/users/create-user");
const get_user_dto_1 = require("../../utils/users/get-user-dto");
const login_user_1 = require("../../utils/users/login-user");
const mongoose_1 = __importDefault(require("mongoose"));
describe('User API body validation check', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let testEntity = {};
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoURI);
        yield (0, supertest_1.default)(app).delete(paths_1.TESTING_PATH);
    }));
    it('shouldn\'t login user with incorrect input data, 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponce = yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);
        yield (0, login_user_1.loginUser)(app, { loginOrEmail: 'ttt', password: 'ttt' }, responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, login_user_1.loginUser)(app, { loginOrEmail: testEntity.login, password: 'ttt' }, responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, login_user_1.loginUser)(app, { loginOrEmail: 444, password: '' }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.loginOrEmail.NOT_A_STRING, apiErrors_1.API_ERRORS.password.NOT_FIND]);
    }));
    it('shouldn\'t create user with ununique login or email , 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const createUserDto = {
            login: 'testLogin',
            password: '1234567',
            email: 'testemail@mail.ru'
        };
        const createResponce = yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(createUserDto), responseCodes_1.HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);
        yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(Object.assign(Object.assign({}, createUserDto), { email: 'lolololo@mail.ru' })), responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.login.MUST_BE_UNIQUE]);
        yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(Object.assign(Object.assign({}, createUserDto), { login: 'lololo' })), responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.email.MUST_BE_UNIQUE]);
        const response = yield (0, supertest_1.default)(app)
            .get(paths_1.USER_PATH)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    }));
    it('shouldn\'t authorization with incorrect login or password, 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post(paths_1.USER_PATH)
            .auth('admin1', 'qwerty2')
            .send((0, get_user_dto_1.getUserDto)())
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .delete(paths_1.USER_PATH + `/${testEntity.id}`)
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .get(paths_1.AUTH_PATH + '/me')
            .set('Authorization', `Bearer ${'asdasda.123123.dsadsa'}`)
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .get(paths_1.USER_PATH)
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
    }));
    it('should return Unauthorized if refreshtoken is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const responce = yield (0, supertest_1.default)(app)
            .post(paths_1.AUTH_PATH + '/refresh-token')
            .set('Cookie', [`refreshToken=${'refreshToken'}`])
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
});
