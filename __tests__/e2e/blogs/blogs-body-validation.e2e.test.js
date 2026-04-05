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
const create_blog_1 = require("../../utils/blogs/create-blog");
const get_blog_dto_1 = require("../../utils/blogs/get-blog-dto");
const mongoose_1 = __importDefault(require("mongoose"));
describe('Blog API body validation check', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let testEntity = {};
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoURI);
        yield (0, supertest_1.default)(app).delete(paths_1.TESTING_PATH);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it('shouldn\'t create entity with incorrect input data, 400', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, create_blog_1.createBlog)(app, { name: 5, description: 4, websiteUrl: 6 }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.name.NOT_A_STRING, apiErrors_1.API_ERRORS.description.NOT_A_STRING, apiErrors_1.API_ERRORS.websiteUrl.NOT_A_STRING]);
        yield (0, create_blog_1.createBlog)(app, { name: '', description: '', websiteUrl: '' }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.name.NOT_FIND, apiErrors_1.API_ERRORS.description.NOT_FIND, apiErrors_1.API_ERRORS.websiteUrl.NOT_FIND]);
        yield (0, create_blog_1.createBlog)(app, { name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.name.IS_TOO_LONG, apiErrors_1.API_ERRORS.websiteUrl.NOT_CORRECT]);
        yield (0, supertest_1.default)(app)
            .get(paths_1.BLOGS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    }));
    it('shouldn\'t authorization with incorrect login or password, 401', () => __awaiter(void 0, void 0, void 0, function* () {
        testEntity = yield (0, create_blog_1.createBlog)(app, (0, get_blog_dto_1.getBlogDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        yield (0, supertest_1.default)(app)
            .post(paths_1.BLOGS_PATH)
            .auth('admin1', 'qwerty2')
            .send((0, get_blog_dto_1.getBlogDto)())
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .put(paths_1.BLOGS_PATH + `/${testEntity.id}`)
            .send((0, get_blog_dto_1.getBlogDto)())
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .delete(paths_1.BLOGS_PATH + `/${testEntity.id}`)
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .get(paths_1.BLOGS_PATH + `/${testEntity.id}`)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, Object.assign({}, testEntity));
    }));
    it('should return not found with incorrect id, 404', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .put(paths_1.BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .send((0, get_blog_dto_1.getBlogDto)())
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        yield (0, supertest_1.default)(app)
            .delete(paths_1.BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        yield (0, supertest_1.default)(app)
            .get(paths_1.BLOGS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        yield (0, supertest_1.default)(app)
            .get(paths_1.BLOGS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [Object.assign({}, testEntity)] });
    }));
    it('shouldn\'t update entity with incorrect input data, 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEntities1 = yield (0, create_blog_1.createBlog)(app, (0, get_blog_dto_1.getBlogDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        const testEntities2 = yield (0, create_blog_1.createBlog)(app, (0, get_blog_dto_1.getBlogDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        yield (0, supertest_1.default)(app)
            .put(paths_1.BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ name: 5, description: 4, websiteUrl: 6 })
            .expect(responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [apiErrors_1.API_ERRORS.name.NOT_A_STRING, apiErrors_1.API_ERRORS.description.NOT_A_STRING, apiErrors_1.API_ERRORS.websiteUrl.NOT_A_STRING]
        });
        yield (0, supertest_1.default)(app)
            .put(paths_1.BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ name: '', description: '', websiteUrl: '' })
            .expect(responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [apiErrors_1.API_ERRORS.name.NOT_FIND, apiErrors_1.API_ERRORS.description.NOT_FIND, apiErrors_1.API_ERRORS.websiteUrl.NOT_FIND]
        });
        yield (0, supertest_1.default)(app)
            .put(paths_1.BLOGS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ name: 'yturiehfjdnxhddf', description: '6', websiteUrl: 'www.dad@' })
            .expect(responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [apiErrors_1.API_ERRORS.name.IS_TOO_LONG, apiErrors_1.API_ERRORS.websiteUrl.NOT_CORRECT]
        });
        yield (0, supertest_1.default)(app)
            .get(paths_1.BLOGS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items: [
                Object.assign({}, testEntities2),
                Object.assign({}, testEntities1),
                Object.assign({}, testEntity)
            ] });
    }));
});
