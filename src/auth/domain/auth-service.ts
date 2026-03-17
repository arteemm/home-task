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


export class AuthService {
    constructor(
        protected nodeMailerManager: NodeMailerManager,
        protected emailExamples: EmailExamples,
        protected usersRepository: UsersRepository,
        protected userService: UserService,
        protected jwtService: JwtService,
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

    async loginUser(loginOrEmail: string, password: string): Promise<string> {
        const result = await this.checkUserCredentials(loginOrEmail, password);

        if (!result.isPasswordValid || !result.userId) {
            throw new Error('Unauthorized');
        }

        const accessToken = await this.jwtService.createJWT(result.userId);

        return accessToken;
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
};