"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentDto = getCommentDto;
function getCommentDto(data) {
    return {
        content: (data === null || data === void 0 ? void 0 : data.content) || 'stringstringstringst',
    };
}
