import jwt from 'jsonwebtoken';
import { appConfig } from '../../core/config/config';

export class JwtService {
    async createJWT(userId: string) {
        const token = jwt.sign({userId: userId}, appConfig.SECRET_KEY, { expiresIn: '1h'})
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
}