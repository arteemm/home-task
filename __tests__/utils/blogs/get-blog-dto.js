"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogDto = getBlogDto;
function getBlogDto(data) {
    return {
        name: (data === null || data === void 0 ? void 0 : data.name) || 'name',
        description: (data === null || data === void 0 ? void 0 : data.description) || 'description',
        websiteUrl: (data === null || data === void 0 ? void 0 : data.websiteUrl) || 'https://google1mail.ru'
    };
}
