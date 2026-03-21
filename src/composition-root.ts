import { AuthService } from './auth/domain/auth-service';
import { UsersRepository } from './users/repositories/user.repository';
import { JwtService } from './auth/adapters/jwt.service';
import { UserService } from './users/domain/user-service';
import { NodeMailerManager } from './auth/adapters/nodeMailer-manager';
import { EmailExamples } from './auth/adapters/emailExamples';
import { AuthRepository } from './auth/repositories/auth.repository';
import { usersCollection, expiredRefreshTokentsCollection } from './repositories/db';


const usersRepository = new UsersRepository(usersCollection);
export const userService = new UserService(usersRepository);

const nodeMailerManager = new NodeMailerManager();
const emailExamples = new EmailExamples();
export const jwtService = new JwtService();

const authRepository = new AuthRepository(expiredRefreshTokentsCollection);


export const authService = new AuthService(
    nodeMailerManager,
    emailExamples,
    usersRepository,
    userService,
    jwtService,
    authRepository,
);

