import { Request, Response } from 'express';
import { usersQueryRepository } from '../../users/repositories/user.query.repository';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { LoginUserViewModel } from '../types/login-user-view-model';
import { LoginUserDto } from '../types/login-user-dto';
import { SessionDto } from '../../securityDevices/types/session.dto';
import { AuthService } from '../domain/auth-service';
import { inject, injectable } from 'inversify';
import { rateLimitRepository } from '../repositories/rate.limit.repositories';
import { CreateUserDto } from '../../users/types/create-user-dto';
import { API_ERRORS } from '../../core/constants/apiErrors';


@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) protected authService: AuthService,
    ) {}

    async getLoginedUser(req: Request, res: Response<LoginUserViewModel>) {
        const userId = req.userId as string;
        const user = await usersQueryRepository.findById(userId);

        if (!user) {
            return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
        }

        return res.status(HttpResponceCodes.OK_200).send({
            email: user.email,
            login: user.login,
            userId: user.id,
        });
    }

    async getNewAccessAndRefreshTokensHandler(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
        const expiredRefreshToken = req.cookies.refreshToken;
        const userId = req.userId as string;
    
        try {
            const sessionDto: SessionDto = {
                ip: req.ip || 'lol',
                title: req.headers['user-agent'] || 'default',
                originalUrl: req.originalUrl,
            };
            const {accessToken, newRefreshToken} = await this.authService.getNewAccessAndRefreshTokens(userId, expiredRefreshToken, sessionDto);
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    
            res.status(HttpResponceCodes.OK_200).send({accessToken: accessToken});
        } catch(e: unknown) {
            const err = e as { message: string };
            if (err?.message === 'Unauthorized') {
                res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
            }
    
            throw new Error('some error in refresh token');
        }
    };

    async loginUser(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
        try {
            const { loginOrEmail, password } = req.body;
            const sessionDto: SessionDto = {
                ip: req.ip || 'lol',
                title: req.headers['user-agent'] || 'default',
                originalUrl: req.originalUrl,
            };
            const {accessToken, refreshToken } = await this.authService.loginUser(loginOrEmail, password, sessionDto);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            
            const limitId = Buffer.from(sessionDto.ip + sessionDto.originalUrl).toString('base64');
            await rateLimitRepository.deleteAllActivities(limitId);
            return res.status(HttpResponceCodes.OK_200).send({accessToken: accessToken});
        } catch(e: unknown) {
            const err = e as { message: string };
    
            if (err?.message === 'Unauthorized') {
                return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
            }
    
            throw new Error('some error in loginUser');
        }
    };

    async logoutUserHandler(req: Request<{}, {}, LoginUserDto, {}>, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const userId = req.userId as string;

        try {
            await this.authService.logoutUser(userId, refreshToken);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e) {
            const err = e as { message: string };

            if (err?.message === 'Unauthorized') {
                return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
            }

            throw new Error('some error in logout user');
        }
    }
    async registrationUser(req: Request<{}, {}, CreateUserDto, {}>, res: Response) {
        try {
            const { login, password, email } = req.body;
            const responce = await this.authService.createUser({ login, password, email });
    
            const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
            await rateLimitRepository.deleteAllActivities(limitId);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e: unknown) {
            const err = e as { message: string };
            if (err?.message === 'login is not unique') {
               return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.login.MUST_BE_UNIQUE ]});
            }
    
            if (err?.message === 'email is not unique') {
               return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.email.MUST_BE_UNIQUE ]});
            }
    
            throw new Error('some error in create user handler');
        }
    };

    async registrationConfirmationUser(req: Request<{}, {}, {code: string}, {}>, res: Response) {
        try {
            const { code } = req.body;
            const responce = await this.authService.registrationConfirmation(code);
        
            const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
            await rateLimitRepository.deleteAllActivities(limitId);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e: unknown) {
            const err = e as { message: string };
            if (err?.message === 'user is not exist') {
            return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.NOT_FIND ]});
            }

            if (err?.message === 'expired code') {
            return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.EXPIRED ]});
            }

            if (err?.message === 'user has already been applied') {
            return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.APPLIED ]});
            }

            throw new Error('some error in create user handler');
        }
    };

    async registrationEmailResending(req: Request<{}, {}, {email: string}, {}>, res: Response) {
        try {
            const { email } = req.body;
            const responce = await this.authService.registrationEmailResending(email);

            const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
            await rateLimitRepository.deleteAllActivities(limitId);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e: unknown) {
            const err = e as { message: string };
            if (err?.message === 'user is not exist') {
            return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.email.NOT_FIND ]});
            }

            if (err?.message === 'user has already been applied') {
            return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.email.APPLIED ]});
            }

            throw new Error('some error in create user handler');
        }
    };

    async passwordRecovery(req: Request<{}, {}, {email: string}, {}>, res: Response) {
        try {
            const { email } = req.body;
            const responce = await this.authService.passwordRecovery(email);

            const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
            await rateLimitRepository.deleteAllActivities(limitId);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e: unknown) {
            console.error(e)
            const err = e as { message: string };
            throw new Error('some error in password recovery handler');
        }
    };

    async newPasswordConfirmation(req: Request<{}, {}, {newPassword: string, recoveryCode: string}, {}>, res: Response) {
        try {
            const { newPassword, recoveryCode } = req.body;
            const responce = await this.authService.newPasswordConfirmation(newPassword, recoveryCode);
        
            const limitId = Buffer.from(req.ip + req.originalUrl).toString('base64');
            await rateLimitRepository.deleteAllActivities(limitId);
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e: unknown) {
            const err = e as { message: string };
                if (err?.message === 'user is not exist') {
                return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.NOT_FIND ]});
            }

            if (err?.message === 'expired code') {
                return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.EXPIRED ]});
            }

            if (err?.message === 'user has already been applied') {
                return res.status(HttpResponceCodes.BAD_REQUEST_400).send({errorsMessages: [ API_ERRORS.code.APPLIED ]});
            }

            throw new Error('some error in create user handler');
        }
    };
}