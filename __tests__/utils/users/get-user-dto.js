"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDto = getUserDto;
function getUserDto(data) {
    return {
        login: (data === null || data === void 0 ? void 0 : data.login) || 'loginname',
        password: (data === null || data === void 0 ? void 0 : data.password) || 'password',
        email: (data === null || data === void 0 ? void 0 : data.email) || 'google1mail@mail.ru'
    };
}
