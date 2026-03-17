import request from 'supertest';
import express from 'express';
import { AuthService } from '../../../src/auth/domain/auth-service';
import { UsersRepository } from '../../../src/users/repositories/user.repository';
import { JwtService } from '../../../src/auth/adapters/jwt.service';
import { UserService } from '../../../src/users/domain/user-service';
import { NodeMailerManager } from '../../../src/auth/adapters/nodeMailer-manager';
import { EmailExamples } from '../../../src/auth/adapters/emailExamples';
import { usersQueryRepository } from '../../../src/users/repositories/user.query.repository';
import { MongoMemoryServer } from 'mongodb-memory-server-global-4.4';
import mongodb, { MongoClient, Db, Collection,  } from 'mongodb';


jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-v4',
  // mock other exports as needed
}));

describe('integration test for AuthService', () => {
    let mongoServer: MongoMemoryServer;
    let client: MongoClient;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        client = new MongoClient(mongoUri);
        await client.connect();
        const t = client.db('home-task');
        await t.dropDatabase();
    });

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    })

    const usersRepository = new UsersRepository();
    const userService = new UserService(usersRepository);

    const nodeMailerManagerMock: jest.Mocked<NodeMailerManager> = {
        sendEmailConfirmationMessage: jest.fn()
    };
    const emailExamples = new EmailExamples();
    const jwtService = new JwtService();

    const authService = new AuthService(
        nodeMailerManagerMock,
        emailExamples,
        usersRepository,
        userService,
        jwtService,
    );

    describe('createUser', () => {
        it('should return', async () => {
            const email = 'emailLo1ll@mail.ru';
            const login = 'lololol';
            const result = await authService.createUser({email, login, 'password': '11234'});
            const user = await usersQueryRepository.findById(result);

            expect(user?.email).toBe(email);
            expect(user?.login).toBe(login);
        });
    });
});
