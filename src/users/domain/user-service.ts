import { User } from './user.entity';
import { CreateUserDto } from '../types/create-user-dto';
import { UsersRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UserModel } from '../infrastructure/mongoose/user.shema';


@injectable()
export class UserService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository
    ) {}

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

        const newUserInstance = User.create(dto.login, dto.email, passwordHash, passwordSalt);

        const newUser = new UserModel(newUserInstance);

        return this.usersRepository.create(newUser);
    }

    async deleteUser(id: string) {
        return this.usersRepository.delete(id);
    }

    async generateHash(password: string, passwordSalt: string) {
        const hash = await bcrypt.hash(password, passwordSalt);
        return hash;
    }

   async checkUniqueLoginorEmail(loginOrEmail: string): Promise<boolean> {
        const checkloginOrEmail = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        return !checkloginOrEmail;
   }
}
