import { add } from 'date-fns';

export class User {
    constructor(
        public userName: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
        public createdAt: string,
        public emailConfirmation: EmailConfirmation,
        public passwordRecovery: PasswordRecovery,
    ) {}

    static create(login: string, email: string, passwordHash: string, passwordSalt: string): User {
        return new User(
            login,
            email,
            passwordHash,
            passwordSalt,
            new Date().toISOString(),
            {
                confirmationCode: crypto.randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    // minutes: 1,
                }),
                isConfirmed: false,
            },
            {
                recoveryCode: crypto.randomUUID(),
                recoveryExpirationDate: add(new Date(), {
                    hours: 1,
                    // minutes: 1,
                }),
                isRecovered: false,
            }
        )
    }
}


type EmailConfirmation = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};

type PasswordRecovery = {
    recoveryCode: string;
    recoveryExpirationDate: Date;
    isRecovered: boolean;
};