import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthService } from '../auth/domain/auth-service';
import { UsersRepository } from '../users/repositories/user.repository';
import { JwtService } from '../auth/adapters/jwt.service';
import { UserService } from '../users/domain/user-service';
import { NodeMailerManager } from '../auth/adapters/nodeMailer-manager';
import { EmailExamples } from '../auth/adapters/emailExamples';
import { usersCollection, securityDevicesCollection } from '../repositories/db';
import { SecurityDevicesRepository } from '../securityDevices/repositories/securityDevices.repository';
import { SecurityDevicesService } from '../securityDevices/domain/securityDevices.service';
import { UserController } from '../users/routers/user-controller';
import { AuthController } from '../auth/routers/auth-controller';
import { TYPES } from './types';


export const container = new Container();

container.bind(UserController).to(UserController);
container.bind(UserService).to(UserService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(NodeMailerManager).to(NodeMailerManager);
container.bind(EmailExamples).to(EmailExamples);
container.bind(JwtService).to(JwtService);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(AuthService).to(AuthService);
container.bind<AuthController>(AuthController).to(AuthController);
container.bind(TYPES.UsersCollection).toConstantValue(usersCollection);
container.bind(TYPES.SecurityDevicesCollection).toConstantValue(securityDevicesCollection);