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
const get_post_dto_1 = require("../../utils/posts/get-post-dto");
const create_post_1 = require("../../utils/posts/create-post");
const mongoose_1 = __importDefault(require("mongoose"));
describe('Post API body validation check', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let testEntity = {};
    let testBlogId = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoURI);
        yield (0, supertest_1.default)(app).delete(paths_1.TESTING_PATH);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it('shouldn\'t create entity with incorrect input data, 400', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, create_post_1.createPost)(app, { title: 5, shortDescription: 4, content: 6, blogId: 1 }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.title.NOT_A_STRING, apiErrors_1.API_ERRORS.shortDescription.NOT_A_STRING, apiErrors_1.API_ERRORS.content.NOT_A_STRING, apiErrors_1.API_ERRORS.blogId.NOT_A_STRING]);
        yield (0, create_post_1.createPost)(app, { title: '', shortDescription: '', content: '', blogId: '' }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.title.NOT_FIND, apiErrors_1.API_ERRORS.shortDescription.NOT_FIND, apiErrors_1.API_ERRORS.content.NOT_FIND, apiErrors_1.API_ERRORS.blogId.NOT_FIND]);
        yield (0, create_post_1.createPost)(app, { title: 'yturiehfjdnxhddfyturiehfjdnxhddfyturiehfjdnxhddf', shortDescription: '6', blogId: '1' }, responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, [apiErrors_1.API_ERRORS.title.IS_TOO_LONG, apiErrors_1.API_ERRORS.content.NOT_FIND, apiErrors_1.API_ERRORS.blogId.NOT_FIND_BLOG_ID]);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    }));
    it('shouldn\'t authorization with incorrect login or password, 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const createBlod = yield (0, create_blog_1.createBlog)(app, (0, get_blog_dto_1.getBlogDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        testBlogId = createBlod.id;
        testEntity = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: testBlogId }), responseCodes_1.HttpResponceCodes.CREATED_201);
        yield (0, supertest_1.default)(app)
            .post(paths_1.POSTS_PATH)
            .auth('admin1', 'qwerty2')
            .send((0, get_post_dto_1.getPostDto)({ blogId: testBlogId }))
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .put(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .send((0, get_post_dto_1.getPostDto)({ blogId: testBlogId }))
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .delete(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .expect(responseCodes_1.HttpResponceCodes.NOT_AUTHORIZED_401);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, Object.assign({}, testEntity));
    }));
    it('should return not found with incorrect id, 404', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .put(paths_1.POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .send((0, get_post_dto_1.getPostDto)({ blogId: testBlogId }))
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        yield (0, supertest_1.default)(app)
            .delete(paths_1.POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH + `/2`)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [Object.assign({}, testEntity)] });
    }));
    it('shouldn\'t update entity with incorrect input data, 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEntities1 = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: testBlogId }), responseCodes_1.HttpResponceCodes.CREATED_201);
        ;
        const testEntities2 = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: testBlogId }), responseCodes_1.HttpResponceCodes.CREATED_201);
        ;
        yield (0, supertest_1.default)(app)
            .put(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ title: 5, shortDescription: 4, content: 6, blogId: 1 })
            .expect(responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [apiErrors_1.API_ERRORS.title.NOT_A_STRING, apiErrors_1.API_ERRORS.shortDescription.NOT_A_STRING, apiErrors_1.API_ERRORS.content.NOT_A_STRING, apiErrors_1.API_ERRORS.blogId.NOT_A_STRING]
        });
        yield (0, supertest_1.default)(app)
            .put(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ title: '', shortDescription: '', content: '', blogId: '' })
            .expect(responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [apiErrors_1.API_ERRORS.title.NOT_FIND, apiErrors_1.API_ERRORS.shortDescription.NOT_FIND, apiErrors_1.API_ERRORS.content.NOT_FIND, apiErrors_1.API_ERRORS.blogId.NOT_FIND]
        });
        yield (0, supertest_1.default)(app)
            .put(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send({ title: 'yturiehfjdnxhddfyturiehfjdnxhddfyturiehfjdnxhddf', shortDescription: '6', blogId: '1' })
            .expect(responseCodes_1.HttpResponceCodes.BAD_REQUEST_400, {
            errorsMessages: [apiErrors_1.API_ERRORS.title.IS_TOO_LONG, apiErrors_1.API_ERRORS.content.NOT_FIND, apiErrors_1.API_ERRORS.blogId.NOT_FIND_BLOG_ID]
        });
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items: [
                Object.assign({}, testEntities2),
                Object.assign({}, testEntities1),
                Object.assign({}, testEntity)
            ] });
    }));
});
