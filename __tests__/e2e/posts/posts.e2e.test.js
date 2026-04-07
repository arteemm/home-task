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
const create_blog_1 = require("../../utils/blogs/create-blog");
const get_blog_dto_1 = require("../../utils/blogs/get-blog-dto");
const get_post_dto_1 = require("../../utils/posts/get-post-dto");
const create_post_1 = require("../../utils/posts/create-post");
const mongoose_1 = __importDefault(require("mongoose"));
describe(paths_1.POSTS_PATH, () => {
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
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    }));
    it('should create entity with correct input data, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        const createBlod = yield (0, create_blog_1.createBlog)(app, (0, get_blog_dto_1.getBlogDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        testBlogId = createBlod.id;
        const createResponce = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: testBlogId }), responseCodes_1.HttpResponceCodes.CREATED_201);
        testEntity = structuredClone(createResponce);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [Object.assign({}, createResponce)] });
    }));
    it('should update entity with correct input data, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEntities1 = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: testBlogId }), responseCodes_1.HttpResponceCodes.CREATED_201);
        const testEntities2 = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: testBlogId }), responseCodes_1.HttpResponceCodes.CREATED_201);
        const updateEntityDto = { title: 'updated1', shortDescription: 'updated1', content: 'https://updated1.ru', blogId: testBlogId };
        yield (0, supertest_1.default)(app)
            .put(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .send((0, get_post_dto_1.getPostDto)(updateEntityDto))
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 3, items: [
                Object.assign({}, testEntities2),
                Object.assign({}, testEntities1),
                Object.assign(Object.assign({}, testEntity), updateEntityDto)
            ] });
    }));
    it('should delete entity with correct  id, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete(paths_1.POSTS_PATH + `/${testEntity.id}`)
            .auth('admin', 'qwerty')
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH + `/${testEntity.id}`).expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        const response = yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH)
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    }));
});
