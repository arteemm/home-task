import jwt from 'jsonwebtoken';
import { appConfig } from '../../core/config/config';
import { add } from 'date-fns';
import { inject, injectable } from 'inversify';


@injectable()
export class JwtService {
    async createAccessToken(userId: string) {
        const token = jwt.sign({userId: userId, date: Date.now()}, appConfig.SECRET_KEY, {
            expiresIn: '10s'
            // expiresIn: `1h`
        })
        return token;
    }

    async createRefreshToken(userId: string, deviceId: string) {
        const token = jwt.sign({userId: userId, deviceId: deviceId, date: Date.now()}, appConfig.SECRET_KEY, {
            expiresIn: '20s'
            // expiresIn: `24h`
        })
        return token;
    }
    
    async getUserIdByToken(token: string) {
        try {
            return jwt.verify(token, appConfig.SECRET_KEY) as { userId: string };
        } catch(e: unknown) {
            
            if (process.env.NODE_ENV !== 'test') {
                console.error('token verify error ' + e);
            }

            return null;
        }
    }

    async getDataByToken(token: string) {
        try {
            return jwt.verify(token, appConfig.SECRET_KEY) as { iat: number, exp: number, deviceId: string };
        } catch(e: unknown) {
            throw new Error('token verify error');
        }
    }
}