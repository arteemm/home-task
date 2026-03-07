import { CreateUserDto } from '../../../src/users/types/create-user-dto';

export function getUserDto (data?: Partial<CreateUserDto>): CreateUserDto {
    return {
        login: data?.login || 'loginname',
        password: data?.password || 'password',
        email: data?.email || 'google1mail@mail.ru'
    };
}