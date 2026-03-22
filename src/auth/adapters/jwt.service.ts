import jwt from 'jsonwebtoken';
import { appConfig } from '../../core/config/config';
import { add } from 'date-fns';

export class JwtService {
    async createAccessToken(userId: string) {
        const iat = add(new Date(), { hours: 1}); // minutes: 1 });
        const token = jwt.sign({userId: userId, date: Date.now()}, appConfig.SECRET_KEY, { expiresIn: `1h`})
        return token;
    }

    async createRefreshToken(userId: string, deviceId: string) {
        const token = jwt.sign({userId: userId, deviceId: deviceId, date: Date.now()}, appConfig.SECRET_KEY, { expiresIn: `24h`})
        return token;
    }
    
    async getUserIdByToken(token: string) {
        try {
            return jwt.verify(token, appConfig.SECRET_KEY) as { userId: string };
        } catch(e: unknown) {
            console.error('token verify error ' + e);
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