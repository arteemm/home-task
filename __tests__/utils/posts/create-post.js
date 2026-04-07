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
exports.createPost = createPost;
const supertest_1 = __importDefault(require("supertest"));
const paths_1 = require("../../../src/core/constants/paths");
const responseCodes_1 = require("../../../src/core/constants/responseCodes");
function createPost(app, data, expectedHttpStatus, expectedErrorsMessages) {
    return __awaiter(this, void 0, void 0, function* () {
        const responce = yield (0, supertest_1.default)(app)
            .post(paths_1.POSTS_PATH)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedHttpStatus);
        const createdEntity = responce.body;
        if (expectedHttpStatus === responseCodes_1.HttpResponceCodes.CREATED_201) {
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: createdEntity.title,
                shortDescription: createdEntity.shortDescription,
                content: createdEntity.content,
                blogId: createdEntity.blogId,
                blogName: createdEntity.blogName,
                createdAt: createdEntity.createdAt,
            });
        }
        if (expectedErrorsMessages) {
            expect(createdEntity).toEqual({ errorsMessages: expectedErrorsMessages });
        }
        return createdEntity;
    });
}
