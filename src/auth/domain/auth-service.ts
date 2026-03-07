import { usersRepository } from '../../users/repositories/user.repository';
import bcrypt from 'bcrypt';

export const authService = {
    async checkUserCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return false;

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        return isPasswordValid;
    },
};