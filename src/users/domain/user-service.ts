import { UserDBtype } from '../types/userDBtype';
import { CreateUserDto } from '../types/create-user-dto';
import { usersRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';


export const userService = {
    async createUser(dto: CreateUserDto): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.generateHash(dto.password, passwordSalt);
        const checkUniqueLogin = await this.checkUniqueLoginorEmail(dto.login);
        const checkUniqueEmail = await this.checkUniqueLoginorEmail(dto.email);

        if (!checkUniqueLogin) {
            throw new Error('login is not unique')
        }

        if (!checkUniqueEmail) {
            throw new Error('email is not unique')
        }

        const newUser: UserDBtype = {
            userName: dto.login,
            email: dto.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
        };

        return usersRepository.create(newUser);
    },

    async deleteUser(id: string) {
        return usersRepository.delete(id);
    },

    async generateHash(password: string, passwordSalt: string) {
        const hash = await bcrypt.hash(password, passwordSalt);
        return hash;
    },

   async checkUniqueLoginorEmail(loginOrEmail: string): Promise<boolean> {
        const checkloginOrEmail = await usersRepository.findByLoginOrEmail(loginOrEmail);
        return !checkloginOrEmail;
   },
};
