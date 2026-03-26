import { AuthService } from '../../../src/auth/domain/auth-service';
import { UsersRepository } from '../../../src/users/repositories/user.repository';
import { JwtService } from '../../../src/auth/adapters/jwt.service';
import { UserService } from '../../../src/users/domain/user-service';
import { NodeMailerManager } from '../../../src/auth/adapters/nodeMailer-manager';
import { EmailExamples } from '../../../src/auth/adapters/emailExamples';
import { MongoMemoryServer } from 'mongodb-memory-server-global-4.4';
import { MongoClient, Db, Collection, ObjectId,  } from 'mongodb';
import { IUserDB } from '../../../src/users/types/userDBInterface';
import { add } from 'date-fns';
import { SecurityDevicesRepository }  from '../../../src/securityDevices/repositories/securityDevices.repository';
import { SecurityDevicesService }  from '../../../src/securityDevices/domain/securityDevices.service';
import { SecurityDevicesDBtype }  from '../../../src/securityDevices/types/securityDevicesDBtype';


describe('integration test for AuthService', () => {
    let mongoServer: MongoMemoryServer;
    let client: MongoClient;
    let db: Db;
    let usersCollection: Collection<IUserDB>;
    let securityDevicesCollection: Collection<SecurityDevicesDBtype>;
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
        client = new MongoClient(mongoUri);
        db = client.db('test')
        usersCollection = db.collection<IUserDB>('users');
        securityDevicesCollection = db.collection<SecurityDevicesDBtype>('security-devices');
        await client.connect();

        emailExamples = new EmailExamples();
        jwtService = new JwtService();

        usersRepository = new UsersRepository(usersCollection);
        userService = new UserService(usersRepository);
        securityDevicesRepository = new SecurityDevicesRepository(securityDevicesCollection);
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
        await client.close();
        await mongoServer.stop();
    })

    describe('createUser', () => {
        beforeAll(async () => {
            await db.dropDatabase();
        })

        const userEmail = 'userEmailLo1ll@mail.ru';
        const userLogin = 'userLogin';
        const userEmail2 = 'user2EmailLo1ll@mail.ru';
        const userLogin2 = 'user2Login';
        const userSMTPEmail = 'emailLo1ll@mail.ru';
        const userSMTPLogin = 'userSMTPLogin';
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
            await db.dropDatabase();
        })

        const correctcondirmationCode1 = 'superCode';
        const correctcondirmationCode2 = 'goodcode';
        const incorrectcondirmationCode = 'lololo';

        const createUser = (condirmationCode: string, expirationDate: Date, ) => {
            return {
                    userName: 'login',
                    email: 'email@mail.ru',
                    passwordHash: 'hash',
                    passwordSalt: 'salt',
                    createdAt: new Date().toISOString(),
                    emailConfirmation: {
                        condirmationCode: condirmationCode,
                        expirationDate: expirationDate,
                        isConfirmed: false,
                    }
                }
        };

        it('should return false for expired confirmatin code', async () => {
            const user = createUser(correctcondirmationCode1, add(new Date(), { minutes: -1 }));
            await usersCollection.insertMany([ user ]);
            const spy = jest.spyOn(usersRepository, 'updateConfirmationStatus');

            try {
                const result = await authService.registrationConfirmation(correctcondirmationCode1) as string;                
            } catch(e) {
                expect(spy).not.toHaveBeenCalled()

                const userModel = await usersCollection.findOne({email: user.email});
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
             await usersCollection.insertMany([ createUser(correctcondirmationCode2, add(new Date(), { minutes: 1 })) ]);

            try {
                const result = await authService.registrationConfirmation(correctcondirmationCode2) as string;
                const userModel = await usersCollection.findOne({_id: new ObjectId(result)});

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
            await db.dropDatabase();
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
            const session = await securityDevicesCollection.findOne({
                        userId: userId,
                        'currentSessions.lastActiveDate': dataByToken.iat,
                        'currentSessions.deviceId': dataByToken.deviceId,
                    });

            expect(session).toEqual({
                _id: expect.any(ObjectId),
                userId: userId,
                currentSessions: [
                    {
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
            const newSession = await securityDevicesCollection.findOne({
                userId: userId,
                'currentSessions.lastActiveDate': newDataByToken.iat,
                'currentSessions.deviceId': newDataByToken.deviceId,
            });
            expect(newSession?.currentSessions).not.toBeNull();
            expect(newSession!.currentSessions).toStrictEqual([
                {
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

});
