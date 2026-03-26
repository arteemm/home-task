import { add } from 'date-fns';

export class User {
    userName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    emailConfirmation: {
        condirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    }

    constructor(login: string, email: string, hash: string, salt: string) {
        this.userName = login;
        this.email = email;
        this.passwordHash = hash;
        this.passwordSalt = salt;
        this.createdAt = new Date().toISOString();
        this.emailConfirmation = {
            condirmationCode: crypto.randomUUID(),
            expirationDate: add(new Date(), {
                hours: 1,
                // minutes: 1,
            }),
            isConfirmed: false,
        }
    }
}