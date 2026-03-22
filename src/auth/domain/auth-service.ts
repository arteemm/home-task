import { UsersRepository } from '../../users/repositories/user.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '../adapters/jwt.service';
import { UserService } from '../../users/domain/user-service';
import { CreateUserDto } from '../../users/types/create-user-dto';
import { User } from '../../users/domain/user.entity';
import { NodeMailerManager } from '../adapters/nodeMailer-manager';
import { EmailExamples } from '../adapters/emailExamples';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { SecurityDevicesService } from '../../securityDevices/domain/securityDevices.service';
import { securityDevicesQueryRepository } from '../../securityDevices/repositories/securityDevices.query.repository';
import { SessionDto } from '../../securityDevices/types/session.dto';
import { CurrentSessions } from '../../securityDevices/types/securityDevicesDBtype';



export class AuthService {
    constructor(
        protected nodeMailerManager: NodeMailerManager,
        protected emailExamples: EmailExamples,
        protected usersRepository: UsersRepository,
        protected userService: UserService,
        protected jwtService: JwtService,
        protected securityDevicesService: SecurityDevicesService,
    ) {}

    async checkUserCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<{isPasswordValid: boolean, userId: string | null}> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return {
            isPasswordValid: false, userId: null
        };

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        return {
            isPasswordValid,
            userId: user._id.toString(),
        };
    }

    private async createNewSession(sessionData: SessionDto, refreshToken: string): Promise<CurrentSessions> {
        const result = await this.jwtService.getDataByToken(refreshToken);

        return {
                ip: sessionData.ip,
                title: sessionData.title,
                lastActiveDate: result!.iat,
                deviceId: result!.deviceId,
        };
    }

    async loginUser(loginOrEmail: string, password: string, sessionData: SessionDto): Promise<{accessToken: string, refreshToken: string}> {
        const result = await this.checkUserCredentials(loginOrEmail, password);

        if (!result.isPasswordValid || !result.userId) {
            throw new Error('Unauthorized');
        }

        const deviceId = uuid();
        const accessToken = await this.jwtService.createAccessToken(result.userId);
        const refreshToken = await this.jwtService.createRefreshToken(result.userId, deviceId);

        const isExistSession = await securityDevicesQueryRepository.checkSessionsByUserId(result.userId);

        if(!isExistSession) {
            const session = await this.createNewSession(sessionData, refreshToken);
            await this.securityDevicesService.createSession(result.userId, session);
        }

        return {accessToken, refreshToken};
    }

    async createUser(dto: CreateUserDto): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.userService.generateHash(dto.password, passwordSalt);
        const checkUniqueLogin = await this.userService.checkUniqueLoginorEmail(dto.login);
        const checkUniqueEmail = await this.userService.checkUniqueLoginorEmail(dto.email);

        if (!checkUniqueLogin) {
            throw new Error('login is not unique')
        }

        if (!checkUniqueEmail) {
            throw new Error('email is not unique')
        }

        const newUser = new User(
            dto.login,
            dto.email,
            passwordHash,
            passwordSalt,
        );

        const createResult = await this.usersRepository.create(newUser);

        try {
            await this.nodeMailerManager.sendEmailConfirmationMessage(
                newUser.email,
                newUser.emailConfirmation.condirmationCode,
                this.emailExamples.registrationEmail
            );
            
        } catch(e) {
            console.error(e);
        }
        
        return createResult;
    }

    async registrationConfirmation(code: string): Promise<string> {
        const user = await this.usersRepository.findByConfirmationCode(code);
        if (!user) {
            throw new Error('user is not exist')
        }

        if (user.emailConfirmation.expirationDate < new Date()) {
            throw new Error('expired code')
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new Error('user has already been applied')
        }

        const id = user._id.toString();

        try {
            await this.usersRepository.updateConfirmationStatus(id);
        } catch(e) {
            console.error('something wrong in registrationConfirmation service')
        }

        return id;
    }

    async registrationEmailResending(email: string): Promise<string> {
        const user = await this.usersRepository.findByLoginOrEmail(email);
        if (!user) {
            throw new Error('user is not exist')
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new Error('user has already been applied')
        }

        const id = user._id.toString();
        const newConfirmationCode = uuid();
        const expirationDate = add(new Date(), {
                hours: 1,
                // minutes: 1,
            });

        try {
            await this.usersRepository.updateConfirmationCode(id, newConfirmationCode, expirationDate);
            await this.nodeMailerManager.sendEmailConfirmationMessage(
                email,
                newConfirmationCode,
                this.emailExamples.registrationEmail
            );
        } catch(e) {
            console.error('something wrong in registrationConfirmation service')
        }

        return id;
    }

    async getNewAccessAndRefreshTokens(userId: string, expiredRefreshToken: string, sessionData: SessionDto) {
        let result;

        try {
            result = await this.jwtService.getDataByToken(expiredRefreshToken);
        } catch(e) {
            const err = e as { message: string };
    
            if (err?.message === 'token verify error') {
                throw new Error('Unauthorized');
            }
    
            throw new Error('some error in Auth services');
        }

        const accessToken = await this.jwtService.createAccessToken(userId);
        const newRefreshToken = await this.jwtService.createRefreshToken(userId, result!.deviceId);
        try {
            const session = await this.createNewSession(sessionData, newRefreshToken);
            await this.securityDevicesService.updateLastActiveDate(userId, session);
        } catch(e) {
            console.error('something wrong in update refresh token');
        }

        return { accessToken, newRefreshToken };
    }

    async logoutUser(userId: string, refreshtoken: string) {
        try {
            // await this.authRepository.update(userId, refreshtoken);
        } catch(e) {
            console.error('something wrong in logout user');
        }
    }
};