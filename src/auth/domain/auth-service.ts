import { usersRepository } from '../../users/repositories/user.repository';
import bcrypt from 'bcrypt';
import { jwtService } from '../adapters/jwt.service';


export const authService = {
    async checkUserCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<{isPasswordValid: boolean, userId: string | null}> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return {
            isPasswordValid: false, userId: null
        };

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        return {
            isPasswordValid,
            userId: user._id.toString(),
        };
    },

    async loginUser(loginOrEmail: string, password: string): Promise<string> {
        const result = await this.checkUserCredentials(loginOrEmail, password);

        if (!result.isPasswordValid || !result.userId) {
            throw new Error('Unauthorized');
        }

        const accessToken = await jwtService.createJWT(result.userId);

        return accessToken;
    }
};