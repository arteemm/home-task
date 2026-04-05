import { UsersRepository } from '../../users/repositories/user.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '../adapters/jwt.service';
import { UserService } from '../../users/domain/user-service';
import { CreateUserDto } from '../../users/types/create-user-dto';
import { User } from '../../users/domain/user.entity';
import { UserModel } from '../../users/infrastructure/mongoose/user.shema'
import { NodeMailerManager } from '../adapters/nodeMailer-manager';
import { EmailExamples } from '../adapters/emailExamples';
import { add } from 'date-fns';
import { SecurityDevicesService } from '../../securityDevices/domain/securityDevices.service';
import { SessionDto } from '../../securityDevices/types/session.dto';
import { CurrentSessions } from '../../securityDevices/domain/security.devices.entity';
import { inject, injectable } from 'inversify';


@injectable()
export class AuthService {
    constructor(
        @inject(NodeMailerManager) protected nodeMailerManager: NodeMailerManager,
        @inject(EmailExamples) protected emailExamples: EmailExamples,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UserService) protected userService: UserService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
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
                originalUrl: sessionData.originalUrl
        };
    }

    private async updateSession(sessionData: Omit<SessionDto, 'title'>, refreshToken: string): Promise<Omit<CurrentSessions, 'title'>> {
        const result = await this.jwtService.getDataByToken(refreshToken);

        return {
                ip: sessionData.ip,
                lastActiveDate: result!.iat,
                deviceId: result!.deviceId,
                originalUrl: sessionData.originalUrl
        };
    }

    async loginUser(loginOrEmail: string, password: string, sessionData: SessionDto): Promise<{accessToken: string, refreshToken: string}> {
        const result = await this.checkUserCredentials(loginOrEmail, password);
        if (!result.isPasswordValid || !result.userId) {
            throw new Error('Unauthorized');
        }

        const deviceId = crypto.randomUUID();
        const accessToken = await this.jwtService.createAccessToken(result.userId);
        const refreshToken = await this.jwtService.createRefreshToken(result.userId, deviceId);
        const isExistSession = await this.securityDevicesService.checkSessionsByUserId(result.userId);
        const session = await this.createNewSession(sessionData, refreshToken);
  
        if(!isExistSession) {
            await this.securityDevicesService.createSession(result.userId, session);
        } else {
            await this.securityDevicesService.addSession(result.userId, session);
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

        const newUserInstance = User.create(
            dto.login,
            dto.email,
            passwordHash,
            passwordSalt,
        );

        const newUser = new UserModel(newUserInstance);
        const createResult = await this.usersRepository.create(newUser);

        try {
            await this.nodeMailerManager.sendEmailConfirmationMessage(
                newUser.email,
                newUser.emailConfirmation.confirmationCode,
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
        const newConfirmationCode = crypto.randomUUID();
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

    async getNewAccessAndRefreshTokens(userId: string, expiredRefreshToken: string, sessionData: Omit<SessionDto, 'title'>) {
        const isNotExpired = await this.securityDevicesService.checkRefreshTokenForExist(userId, expiredRefreshToken);
        if (!isNotExpired) {
            throw new Error('Unauthorized')
        }

        let result;

        try {
            result = await this.jwtService.getDataByToken(expiredRefreshToken);
        } catch(e) {
            throw new Error('Unauthorized');
        }

        const accessToken = await this.jwtService.createAccessToken(userId);
        const newRefreshToken = await this.jwtService.createRefreshToken(userId, result!.deviceId);
        try {
            const session = await this.updateSession(sessionData, newRefreshToken);
            await this.securityDevicesService.updateLastActiveDate(userId, session);
        } catch(e) {
            console.error('something wrong in update refresh token');
        }

        return { accessToken, newRefreshToken };
    }

    async logoutUser(userId: string, refreshToken: string) {
        const result = await this.securityDevicesService.checkRefreshTokenForExist(userId, refreshToken);

        if (!result) {
            throw new Error('Unauthorized')
        }

        try {
            const { deviceId } = await this.jwtService.getDataByToken(refreshToken);
            await this.securityDevicesService.deleteSession(userId, deviceId);
        } catch(e) {
            console.error('something wrong in logout user');
        }
    }

    async passwordRecovery(email: string): Promise<string> {
        let user = await this.usersRepository.findByLoginOrEmail(email);
        if (!user) {
            const userId = await this.createUser({
                login: crypto.randomUUID(),
                password: '111111',
                email: email
            });
            user = await this.usersRepository.findById(userId);
        }

        const id = user!._id.toString();
        const recoveryCode = crypto.randomUUID();
        const expirationDate = add(new Date(), {
                hours: 1,
                // minutes: 1,
            });

        try {
            await this.usersRepository.updateRecoveryCode(id, recoveryCode, expirationDate);
            await this.nodeMailerManager.sendEmailConfirmationMessage(
                email,
                recoveryCode,
                this.emailExamples.passwordRecoveryEmail
            );
        } catch(e) {
            console.error('something wrong in registrationConfirmation service')
        }

        return id;
    }

    async newPasswordConfirmation(newPassword: string, recoveryCode: string): Promise<string> {
        const user = await this.usersRepository.findByRecoveryCode(recoveryCode);

        if (!user) {
            throw new Error('user is not exist')
        }

        const id = user!._id.toString();
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.userService.generateHash(newPassword, passwordSalt);
        try {
            await this.usersRepository.updatePassword(id, passwordHash, passwordSalt);
        } catch(e) {
            console.error('something wrong in new Password AUTH service')
        }

        return id;
    }
};