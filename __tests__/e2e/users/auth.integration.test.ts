import { AuthService } from '../../../src/auth/domain/auth-service';
import { UsersRepository } from '../../../src/users/repositories/user.repository';
import { JwtService } from '../../../src/auth/adapters/jwt.service';
import { UserService } from '../../../src/users/domain/user-service';
import { NodeMailerManager } from '../../../src/auth/adapters/nodeMailer-manager';
import { EmailExamples } from '../../../src/auth/adapters/emailExamples';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';

import { RateLimitModel } from '../../../src/auth/domain/rate.limit.entity';
import { BlogModel } from '../../../src/blogs/domain/blog.entity';
import { CommentModel } from '../../../src/comments/domain/comment.entity';
import { PostModel } from '../../../src/posts/domain/post.entity';
import { SecurityDevicesModel, SecurityDevicesDocument } from '../../../src/securityDevices/domain/security.devices.entity';
import { UserModel, UserDocument, UserEntity } from '../../../src/users/domain/user.entity';

import mongoose, { Mongoose } from 'mongoose';
import { add } from 'date-fns';
import { SecurityDevicesRepository }  from '../../../src/securityDevices/repositories/securityDevices.repository';
import { SecurityDevicesService }  from '../../../src/securityDevices/domain/securityDevices.service';
import { WithId } from 'mongodb';


describe('integration test for AuthService', () => {
    let mongoServer: MongoMemoryServer;
    let usersRepository: UsersRepository;
    let userService: UserService;
    let nodeMailerManagerMock: jest.Mocked<NodeMailerManager>;
    let emailExamples: EmailExamples;
    let jwtService: JwtService;
    let authService: AuthService;
    let securityDevicesService: SecurityDevicesService;
    let securityDevicesRepository: SecurityDevicesRepository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        emailExamples = new EmailExamples();
        jwtService = new JwtService();

        usersRepository = new UsersRepository();
        userService = new UserService(usersRepository);
        securityDevicesRepository = new SecurityDevicesRepository();
        securityDevicesService = new SecurityDevicesService(securityDevicesRepository, jwtService);
        nodeMailerManagerMock = {
            sendEmailConfirmationMessage: jest.fn()
        };


        authService = new AuthService(
            nodeMailerManagerMock,
            emailExamples,
            usersRepository,
            userService,
            jwtService,
            securityDevicesService
        );

    });

    afterAll(async () => {
        await mongoose.connection.close()
        await mongoServer.stop();
    })

    describe('createUser', () => {
        beforeAll(async () => {
            await mongoose?.connection?.db?.dropDatabase();
        })

        const userEmail = 'userEmailLo1ll@mail.ru';
        const userLogin = 'userLogin';
        const userEmail2 = 'user2EmailLo1ll@mail.ru';
        const userLogin2 = 'user2Login';
        const userSMTPEmail = 'emailLo1ll@mail.ru';
        const userSMTPLogin = 'SMTPLogin';
        const dublicateUserEmail = userEmail;
        const dublicateUserLogin = userLogin;

        it('should return correct created user', async () => {
            const result = await authService.createUser({email: userEmail, login: userLogin, 'password': '11234'});
            const user = await usersRepository.findById(result);

            expect(user?.email).toBe(userEmail);
            expect(user?.userName).toBe(userLogin);
        });

        it('this.emailAdapter.sendEmail should be  called', async () => {
            const result = await authService.createUser({email: userSMTPEmail, login: userSMTPLogin, 'password': '11234'});

            expect(nodeMailerManagerMock.sendEmailConfirmationMessage).toHaveBeenCalled()
        });

        it('shoud return 400 because login should be unique', async () => {
            try {
                await authService.createUser({email: userEmail2, login: dublicateUserLogin, 'password': '11234'});
            } catch(e) {
                const err = e as {message: string}
                expect(err.message).toBe('login is not unique');
            }
        })

        it('shoud return 400 because email should be unique', async () => {
            try {
                await authService.createUser({email: dublicateUserEmail, login: userLogin2, 'password': '11234'});
            } catch(e) {
                const err = e as {message: string}
                expect(err.message).toBe('email is not unique');
            }
        })
    });

    describe('confirm Email', () => {
        beforeAll(async () => {
            await mongoose?.connection?.db?.dropDatabase();
        })

        const correctcondirmationCode1 = 'superCode';
        const correctcondirmationCode2 = 'goodcode';
        const incorrectcondirmationCode = 'lololo';

        const createUser = (condirmationCode: string, expirationDate: Date, ): UserEntity => {
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
                }
        };

        it('should return false for expired confirmatin code', async () => {
            const user = createUser(correctcondirmationCode1, add(new Date(), { minutes: -1 }));
            const userModel = new UserModel(user);
            await userModel.save();
            const spy = jest.spyOn(usersRepository, 'updateConfirmationStatus');

            try {
                const result = await authService.registrationConfirmation(correctcondirmationCode1) as string;                
            } catch(e) {
                expect(spy).not.toHaveBeenCalled()

                const userModel = await UserModel.findOne({email: user.email});
                expect(userModel?.emailConfirmation.isConfirmed).toBeFalsy();

                const err = e as {message: string}
                expect(err.message).toBe('expired code');
            }
        });

        it('should return false for not exist confirmatin code', async () => {
            try {
               await authService.registrationConfirmation(incorrectcondirmationCode);
            } catch(e) {
                const err = e as {message: string}
                expect(err.message).toBe('user is not exist');
            }
        });

        it('should return true for not expired and existing confirmatin code', async () => {
             await UserModel.insertMany([ createUser(correctcondirmationCode2, add(new Date(), { minutes: 1 })) ]);

            try {
                const result = await authService.registrationConfirmation(correctcondirmationCode2) as string;
                const userModel = await UserModel.findOne({_id: new ObjectId(result)});

                expect(userModel?.emailConfirmation.isConfirmed).toBeTruthy();

            } catch(e) {
                const err = e as {message: string}
                console.error(e);
                throw new Error('SOMETHING wrong in Confirmation')
            }
        });

    });

    describe('refresh-token', () => {
        beforeAll(async () => {
            await mongoose?.connection?.db?.dropDatabase();
        })
        const ip = '::1';
        const anotherIp = '::2';
        const title = 'testTitle';
        const originalUrl = 'http.com';
        const anotherOriginalUrl = 'www.com';
        let validRefreshToken: string;

        const userDto = {
            login: 'login',
            password: '123456',
            email: 'lol@mail.ru'
        }

        it('should return newRefreshToken', async () => {
            const userId = await authService.createUser(userDto);
            const { accessToken, refreshToken } = await authService.loginUser(userDto.login, userDto.password, {ip: ip, title: title, originalUrl: originalUrl});
            const dataByToken = await jwtService.getDataByToken(refreshToken);
            const session = await SecurityDevicesModel.findOne({
                        userId: userId,
                        'currentSessions.lastActiveDate': dataByToken.iat,
                        'currentSessions.deviceId': dataByToken.deviceId,
                    }).lean();

            expect(session).toEqual({
                __v: expect.any(Number),
                _id: expect.any(ObjectId),
                userId: userId,
                currentSessions: [
                    {
                        _id: expect.any(ObjectId),
                        deviceId: dataByToken.deviceId,
                        ip: ip,
                        title: title,
                        lastActiveDate: dataByToken.iat,
                        originalUrl: originalUrl,
                    }
                ]
            });

            const newPair = await authService.getNewAccessAndRefreshTokens(userId, refreshToken, {ip: anotherIp, originalUrl: anotherOriginalUrl});
            expect(newPair.newRefreshToken).not.toBe(refreshToken);
            expect(newPair.newRefreshToken).toEqual(expect.any(String));
            validRefreshToken = newPair.newRefreshToken;

            const newDataByToken = await jwtService.getDataByToken(newPair.newRefreshToken);
            const newSession = await SecurityDevicesModel.findOne({
                userId: userId,
                'currentSessions.lastActiveDate': newDataByToken.iat,
                'currentSessions.deviceId': newDataByToken.deviceId,
            }).lean();
            expect(newSession?.currentSessions).not.toBeNull();
            expect(newSession!.currentSessions).toStrictEqual([
                {
                    _id: expect.any(ObjectId),
                    deviceId: dataByToken.deviceId,
                    ip: anotherIp,
                    title: title,
                    lastActiveDate: newDataByToken.iat,
                    originalUrl: anotherOriginalUrl,
                }
            ]);
        });

        it('should return Unauthorized for invalit token', async () => {
            const user = {}
        });
    });

    describe('change Password', () => {
        beforeAll(async () => {
            await mongoose?.connection?.db?.dropDatabase();
        })

        const correctcondirmationCode1 = crypto.randomUUID();
        const correctcondirmationCode2 = crypto.randomUUID();
        const incorrectcondirmationCode = 'lololo';
        const newPassword = '123456a';
        const newPassword2 = '987654321a';
        let userModel:WithId<UserDocument> | null;

        const createUser = (condirmationCode: string, expirationDate: Date, ): UserEntity => {
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
                }
        };

        it('should return false for expired confirmatin code', async () => {
            const user = createUser(correctcondirmationCode1, add(new Date(), { minutes: -1 }));
            await UserModel.insertMany([ user ]);
            userModel = await UserModel.findOne({email: user.email});
            const spy = jest.spyOn(usersRepository, 'updatePassword');

            try {
                const result = await authService.newPasswordConfirmation(newPassword, correctcondirmationCode1) as string;                
            } catch(e) {
                expect(spy).not.toHaveBeenCalled();
                expect(userModel?.passwordRecovery.isRecovered).toBeFalsy();

                const err = e as {message: string}
                expect(err.message).toBe('expired code');
            }
        });

        it('should return false for not exist confirmatin code', async () => {
            try {
               await authService.newPasswordConfirmation(newPassword, incorrectcondirmationCode);
            } catch(e) {
                const err = e as {message: string}
                expect(err.message).toBe('user is not exist');
            }
        });

        it('should return true for not expired and existing confirmatin code', async () => {
             await UserModel.updateOne({_id: userModel!._id},
                {$set: {
                    'passwordRecovery.recoveryCode': correctcondirmationCode2,
                    'passwordRecovery.recoveryExpirationDate': add(new Date(), { minutes: 10 })
                }}
            );

            try {
                const result = await authService.newPasswordConfirmation(newPassword2, correctcondirmationCode2) as string;
                const userModel = await UserModel.findOne({_id: new ObjectId(result)});

                expect(userModel?.passwordRecovery.isRecovered).toBeTruthy();

            } catch(e) {
                const err = e as {message: string}
                console.error(e);
                throw new Error('SOMETHING wrong in password recovery Confirmation')
            }

            try {
                await authService.loginUser(userModel!.userName, 'wrongPassword', {ip: '::1', title: 'testTitle', originalUrl: 'http.com'});
            } catch(e) {
                const err = e as {message: string}
                expect(err.message).toBe('Unauthorized');
            }

            const result = await authService.loginUser(userModel!.userName, newPassword2, {ip: '::1', title: 'testTitle', originalUrl: 'http.com'});
            expect(result).toEqual({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            })

        });

    });
});
