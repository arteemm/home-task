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
const create_user_1 = require("../../utils/users/create-user");
const login_user_1 = require("../../utils/users/login-user");
const get_user_dto_1 = require("../../utils/users/get-user-dto");
const create_comment_1 = require("../../utils/comments/create-comment");
const get_comment_dto_1 = require("../../utils/comments/get-comment-dto");
const mongoose_1 = __importDefault(require("mongoose"));
describe(paths_1.COMMENTS_PATH, () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
    let blog = {};
    let post = {};
    let user = {};
    let accessToken;
    let comment = {};
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoURI);
        yield (0, supertest_1.default)(app).delete(paths_1.TESTING_PATH);
        user = yield (0, create_user_1.createUser)(app, (0, get_user_dto_1.getUserDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        const payload = yield (0, login_user_1.loginUser)(app, {
            loginOrEmail: user.login,
            password: (0, get_user_dto_1.getUserDto)().password,
        }, responseCodes_1.HttpResponceCodes.OK_200);
        accessToken = payload.accessToken;
        blog = yield (0, create_blog_1.createBlog)(app, (0, get_blog_dto_1.getBlogDto)(), responseCodes_1.HttpResponceCodes.CREATED_201);
        post = yield (0, create_post_1.createPost)(app, (0, get_post_dto_1.getPostDto)({ blogId: blog.id }), responseCodes_1.HttpResponceCodes.CREATED_201);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH + `/${post.id}/comments`)
            .expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
    }));
    it('should create entity with correct input data, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponce = yield (0, create_comment_1.createComment)(app, (0, get_comment_dto_1.getCommentDto)(), responseCodes_1.HttpResponceCodes.CREATED_201, post.id, accessToken, {
            userId: user.id,
            userLogin: user.login,
        });
        comment = structuredClone(createResponce);
        yield (0, supertest_1.default)(app)
            .get(paths_1.COMMENTS_PATH + `/${comment.id}`)
            .expect(responseCodes_1.HttpResponceCodes.OK_200, Object.assign({}, createResponce));
    }));
    it('should update entity with correct input data, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        const testEntities1 = yield (0, create_comment_1.createComment)(app, (0, get_comment_dto_1.getCommentDto)({ content: 'ololsldkflrmvlfdkvdke' }), responseCodes_1.HttpResponceCodes.CREATED_201, post.id, accessToken, {
            userId: user.id,
            userLogin: user.login,
        });
        const testEntities2 = yield (0, create_comment_1.createComment)(app, (0, get_comment_dto_1.getCommentDto)({ content: 'rtyuifkrniekvpslekikcm' }), responseCodes_1.HttpResponceCodes.CREATED_201, post.id, accessToken, {
            userId: user.id,
            userLogin: user.login,
        });
        const updateDto = { content: '1234567890qwertyuioasdf' };
        yield (0, supertest_1.default)(app)
            .put(paths_1.COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send((0, get_comment_dto_1.getCommentDto)(updateDto))
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        const responce = yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH + `/${post.id}/comments`);
        expect(responce.body.items).toHaveLength(3);
        expect(responce.body.items[1]).toMatchObject({
            id: testEntities1.id,
            content: 'ololsldkflrmvlfdkvdke',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: testEntities1.createdAt,
        });
        expect(responce.body.items[0]).toMatchObject({
            id: testEntities2.id,
            content: 'rtyuifkrniekvpslekikcm',
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: testEntities2.createdAt,
        });
        expect(responce.body.items[2]).toMatchObject({
            id: comment.id,
            content: updateDto.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: comment.createdAt,
        });
    }));
    it('should delete entity with correct  id, 201', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete(paths_1.COMMENTS_PATH + `/${comment.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(responseCodes_1.HttpResponceCodes.NO_CONTENT_204);
        ``;
        yield (0, supertest_1.default)(app)
            .get(paths_1.COMMENTS_PATH + `/${comment.id}`).expect(responseCodes_1.HttpResponceCodes.NOT_FOUND_404);
        const response = yield (0, supertest_1.default)(app)
            .get(paths_1.POSTS_PATH + `/${post.id}/comments`)
            .expect(responseCodes_1.HttpResponceCodes.OK_200);
        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    }));
});
