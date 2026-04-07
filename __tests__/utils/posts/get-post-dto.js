"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostDto = getPostDto;
exports.getPostDtoWithoutBlogId = getPostDtoWithoutBlogId;
function getPostDto(data) {
    return {
        title: (data === null || data === void 0 ? void 0 : data.title) || 'title',
        shortDescription: (data === null || data === void 0 ? void 0 : data.shortDescription) || 'shortDescription',
        content: (data === null || data === void 0 ? void 0 : data.content) || 'content',
        blogId: (data === null || data === void 0 ? void 0 : data.blogId) || 'blogId',
    };
}
function getPostDtoWithoutBlogId(data) {
    return {
        title: (data === null || data === void 0 ? void 0 : data.title) || 'title',
        shortDescription: (data === null || data === void 0 ? void 0 : data.shortDescription) || 'shortDescription',
        content: (data === null || data === void 0 ? void 0 : data.content) || 'content',
    };
}
