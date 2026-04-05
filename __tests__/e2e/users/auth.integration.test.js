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
const auth_service_1 = require("../../../src/auth/domain/auth-service");
const user_repository_1 = require("../../../src/users/repositories/user.repository");
const jwt_service_1 = require("../../../src/auth/adapters/jwt.service");
const user_service_1 = require("../../../src/users/domain/user-service");
const emailExamples_1 = require("../../../src/auth/adapters/emailExamples");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongodb_1 = require("mongodb");
const security_devices_shema_1 = require("../../../src/securityDevices/infrastructure/mongoose/security.devices.shema");
const user_shema_1 = require("../../../src/users/infrastructure/mongoose/user.shema");
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const securityDevices_repository_1 = require("../../../src/securityDevices/repositories/securityDevices.repository");
const securityDevices_service_1 = require("../../../src/securityDevices/domain/securityDevices.service");
describe('integration test for AuthService', () => {
    let mongoServer;
    let usersRepository;
    let userService;
    let nodeMailerManagerMock;
    let emailExamples;
    let jwtService;
    let authService;
    let securityDevicesService;
    let securityDevicesRepository;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        yield mongoose_1.default.connect(mongoUri);
        emailExamples = new emailExamples_1.EmailExamples();
        jwtService = new jwt_service_1.JwtService();
        usersRepository = new user_repository_1.UsersRepository();
        userService = new user_service_1.UserService(usersRepository);
        securityDevicesRepository = new securityDevices_repository_1.SecurityDevicesRepository();
        securityDevicesService = new securityDevices_service_1.SecurityDevicesService(securityDevicesRepository, jwtService);
        nodeMailerManagerMock = {
            sendEmailConfirmationMessage: jest.fn()
        };
        authService = new auth_service_1.AuthService(nodeMailerManagerMock, emailExamples, usersRepository, userService, jwtService, securityDevicesService);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        yield mongoServer.stop();
    }));
    describe('createUser', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            yield ((_b = (_a = mongoose_1.default === null || mongoose_1.default === void 0 ? void 0 : mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.db) === null || _b === void 0 ? void 0 : _b.dropDatabase());
        }));
        const userEmail = 'userEmailLo1ll@mail.ru';
        const userLogin = 'userLogin';
        const userEmail2 = 'user2EmailLo1ll@mail.ru';
        const userLogin2 = 'user2Login';
        const userSMTPEmail = 'emailLo1ll@mail.ru';
        const userSMTPLogin = 'userSMTPLogin';
        const dublicateUserEmail = userEmail;
        const dublicateUserLogin = userLogin;
        it('should return correct created user', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield authService.createUser({ email: userEmail, login: userLogin, 'password': '11234' });
            const user = yield usersRepository.findById(result);
            expect(user === null || user === void 0 ? void 0 : user.email).toBe(userEmail);
            expect(user === null || user === void 0 ? void 0 : user.userName).toBe(userLogin);
        }));
        it('this.emailAdapter.sendEmail should be  called', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield authService.createUser({ email: userSMTPEmail, login: userSMTPLogin, 'password': '11234' });
            expect(nodeMailerManagerMock.sendEmailConfirmationMessage).toHaveBeenCalled();
        }));
        it('shoud return 400 because login should be unique', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield authService.createUser({ email: userEmail2, login: dublicateUserLogin, 'password': '11234' });
            }
            catch (e) {
                const err = e;
                expect(err.message).toBe('login is not unique');
            }
        }));
        it('shoud return 400 because email should be unique', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield authService.createUser({ email: dublicateUserEmail, login: userLogin2, 'password': '11234' });
            }
            catch (e) {
                const err = e;
                expect(err.message).toBe('email is not unique');
            }
        }));
    });
    describe('confirm Email', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            yield ((_b = (_a = mongoose_1.default === null || mongoose_1.default === void 0 ? void 0 : mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.db) === null || _b === void 0 ? void 0 : _b.dropDatabase());
        }));
        const correctcondirmationCode1 = 'superCode';
        const correctcondirmationCode2 = 'goodcode';
        const incorrectcondirmationCode = 'lololo';
        const createUser = (condirmationCode, expirationDate) => {
            return {
                userName: 'login',
                email: 'email@mail.ru',
                passwordHash: 'hash',
                passwordSalt: 'salt',
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: condirmationCode,
                    expirationDate: expirationDate,
                    isConfirmed: false,
                },
                passwordRecovery: {
                    recoveryCode: '111',
                    recoveryExpirationDate: new Date(),
                    isRecovered: false
                }
            };
        };
        it('should return false for expired confirmatin code', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = createUser(correctcondirmationCode1, (0, date_fns_1.add)(new Date(), { minutes: -1 }));
            const userModel = new user_shema_1.UserModel(user);
            yield userModel.save();
            const spy = jest.spyOn(usersRepository, 'updateConfirmationStatus');
            try {
                const result = yield authService.registrationConfirmation(correctcondirmationCode1);
            }
            catch (e) {
                expect(spy).not.toHaveBeenCalled();
                const userModel = yield user_shema_1.UserModel.findOne({ email: user.email });
                expect(userModel === null || userModel === void 0 ? void 0 : userModel.emailConfirmation.isConfirmed).toBeFalsy();
                const err = e;
                expect(err.message).toBe('expired code');
            }
        }));
        it('should return false for not exist confirmatin code', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield authService.registrationConfirmation(incorrectcondirmationCode);
            }
            catch (e) {
                const err = e;
                expect(err.message).toBe('user is not exist');
            }
        }));
        it('should return true for not expired and existing confirmatin code', () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_shema_1.UserModel.insertMany([createUser(correctcondirmationCode2, (0, date_fns_1.add)(new Date(), { minutes: 1 }))]);
            try {
                const result = yield authService.registrationConfirmation(correctcondirmationCode2);
                const userModel = yield user_shema_1.UserModel.findOne({ _id: new mongodb_1.ObjectId(result) });
                expect(userModel === null || userModel === void 0 ? void 0 : userModel.emailConfirmation.isConfirmed).toBeTruthy();
            }
            catch (e) {
                const err = e;
                console.error(e);
                throw new Error('SOMETHING wrong in Confirmation');
            }
        }));
    });
    describe('refresh-token', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            yield ((_b = (_a = mongoose_1.default === null || mongoose_1.default === void 0 ? void 0 : mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.db) === null || _b === void 0 ? void 0 : _b.dropDatabase());
        }));
        const ip = '::1';
        const anotherIp = '::2';
        const title = 'testTitle';
        const originalUrl = 'http.com';
        const anotherOriginalUrl = 'www.com';
        let validRefreshToken;
        const userDto = {
            login: 'login',
            password: '123456',
            email: 'lol@mail.ru'
        };
        it('should return newRefreshToken', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = yield authService.createUser(userDto);
            const { accessToken, refreshToken } = yield authService.loginUser(userDto.login, userDto.password, { ip: ip, title: title, originalUrl: originalUrl });
            const dataByToken = yield jwtService.getDataByToken(refreshToken);
            const session = yield security_devices_shema_1.SecurityDevicesModel.findOne({
                userId: userId,
                'currentSessions.lastActiveDate': dataByToken.iat,
                'currentSessions.deviceId': dataByToken.deviceId,
            }).lean();
            expect(session).toEqual({
                __v: expect.any(Number),
                _id: expect.any(mongodb_1.ObjectId),
                userId: userId,
                currentSessions: [
                    {
                        _id: expect.any(mongodb_1.ObjectId),
                        deviceId: dataByToken.deviceId,
                        ip: ip,
                        title: title,
                        lastActiveDate: dataByToken.iat,
                        originalUrl: originalUrl,
                    }
                ]
            });
            const newPair = yield authService.getNewAccessAndRefreshTokens(userId, refreshToken, { ip: anotherIp, originalUrl: anotherOriginalUrl });
            expect(newPair.newRefreshToken).not.toBe(refreshToken);
            expect(newPair.newRefreshToken).toEqual(expect.any(String));
            validRefreshToken = newPair.newRefreshToken;
            const newDataByToken = yield jwtService.getDataByToken(newPair.newRefreshToken);
            const newSession = yield security_devices_shema_1.SecurityDevicesModel.findOne({
                userId: userId,
                'currentSessions.lastActiveDate': newDataByToken.iat,
                'currentSessions.deviceId': newDataByToken.deviceId,
            }).lean();
            expect(newSession === null || newSession === void 0 ? void 0 : newSession.currentSessions).not.toBeNull();
            expect(newSession.currentSessions).toStrictEqual([
                {
                    _id: expect.any(mongodb_1.ObjectId),
                    deviceId: dataByToken.deviceId,
                    ip: anotherIp,
                    title: title,
                    lastActiveDate: newDataByToken.iat,
                    originalUrl: anotherOriginalUrl,
                }
            ]);
        }));
        it('should return Unauthorized for invalit token', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {};
        }));
    });
    describe('change Password', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            yield ((_b = (_a = mongoose_1.default === null || mongoose_1.default === void 0 ? void 0 : mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.db) === null || _b === void 0 ? void 0 : _b.dropDatabase());
        }));
        const correctcondirmationCode1 = crypto.randomUUID();
        const correctcondirmationCode2 = crypto.randomUUID();
        const incorrectcondirmationCode = 'lololo';
        const newPassword = '123456a';
        const newPassword2 = '987654321a';
        let userModel;
        const createUser = (condirmationCode, expirationDate) => {
            return {
                userName: 'login',
                email: 'email@mail.ru',
                passwordHash: 'hash',
                passwordSalt: 'salt',
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: 'condirmationCode',
                    expirationDate: new Date(),
                    isConfirmed: false,
                },
                passwordRecovery: {
                    recoveryCode: condirmationCode,
                    recoveryExpirationDate: expirationDate,
                    isRecovered: false
                }
            };
        };
        it('should return false for expired confirmatin code', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = createUser(correctcondirmationCode1, (0, date_fns_1.add)(new Date(), { minutes: -1 }));
            yield user_shema_1.UserModel.insertMany([user]);
            userModel = yield user_shema_1.UserModel.findOne({ email: user.email });
            const spy = jest.spyOn(usersRepository, 'updatePassword');
            try {
                const result = yield authService.newPasswordConfirmation(newPassword, correctcondirmationCode1);
            }
            catch (e) {
                expect(spy).not.toHaveBeenCalled();
                expect(userModel === null || userModel === void 0 ? void 0 : userModel.passwordRecovery.isRecovered).toBeFalsy();
                const err = e;
                expect(err.message).toBe('expired code');
            }
        }));
        it('should return false for not exist confirmatin code', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield authService.newPasswordConfirmation(newPassword, incorrectcondirmationCode);
            }
            catch (e) {
                const err = e;
                expect(err.message).toBe('user is not exist');
            }
        }));
        it('should return true for not expired and existing confirmatin code', () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_shema_1.UserModel.updateOne({ _id: userModel._id }, { $set: {
                    'passwordRecovery.recoveryCode': correctcondirmationCode2,
                    'passwordRecovery.recoveryExpirationDate': (0, date_fns_1.add)(new Date(), { minutes: 10 })
                } });
            try {
                const result = yield authService.newPasswordConfirmation(newPassword2, correctcondirmationCode2);
                const userModel = yield user_shema_1.UserModel.findOne({ _id: new mongodb_1.ObjectId(result) });
                expect(userModel === null || userModel === void 0 ? void 0 : userModel.passwordRecovery.isRecovered).toBeTruthy();
            }
            catch (e) {
                const err = e;
                console.error(e);
                throw new Error('SOMETHING wrong in password recovery Confirmation');
            }
            try {
                yield authService.loginUser(userModel.userName, 'wrongPassword', { ip: '::1', title: 'testTitle', originalUrl: 'http.com' });
            }
            catch (e) {
                const err = e;
                expect(err.message).toBe('Unauthorized');
            }
            const result = yield authService.loginUser(userModel.userName, newPassword2, { ip: '::1', title: 'testTitle', originalUrl: 'http.com' });
            expect(result).toEqual({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            });
        }));
    });
});
