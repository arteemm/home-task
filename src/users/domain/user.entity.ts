import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { add } from 'date-fns';


type User = {
    userName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    emailConfirmation: EmailConfirmation;
    passwordRecovery: PasswordRecovery;
};

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

type UserModel = Model<User, {}, UserMethods> & UserStatic;

export type UserDocument = HydratedDocument<User, UserMethods>;

export const UserSchema = new mongoose.Schema<User>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    createdAt: { type: String, required: true, default: new Date().toISOString() },
    emailConfirmation: {
        confirmationCode: { type: String, required: true, default: crypto.randomUUID() },
        expirationDate: { type: Date, required: true, default: add(new Date(), {
                    hours: 1,
                    // minutes: 1,
                }) },
        isConfirmed: { type: Boolean, required: true, default: false },
    },
    passwordRecovery: {
        recoveryCode: { type: String, required: true, default: crypto.randomUUID() },
        recoveryExpirationDate: { type: Date, required: true, default: add(new Date(), {
                    hours: 1,
                    // minutes: 1,
                }) },
        isRecovered: { type: Boolean, required: true, default: false },
    },
});

interface UserStatic {
    createUser(login: string, email: string, passwordHash: string, passwordSalt: string): UserDocument;
}

interface UserMethods {
    // updateBlog(dto: UpdateBlogDto): void;
}

export class UserEntity {
    private constructor(
        public userName: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
        public createdAt: string,
        public emailConfirmation: EmailConfirmation,
        public passwordRecovery: PasswordRecovery,
    ) {}

}

UserSchema.loadClass(UserEntity);

UserSchema.static('createUser', function(login: string, email: string, passwordHash: string, passwordSalt: string): UserDocument {
    const emailConfirmation: EmailConfirmation = {
        confirmationCode: crypto.randomUUID(),
        expirationDate: add(new Date(), {
                    hours: 1,
                    // minutes: 1,
                }),
        isConfirmed: false,
    };

    const passwordRecovery: PasswordRecovery = {
        recoveryCode: crypto.randomUUID(),
        recoveryExpirationDate: add(new Date(), {
                    hours: 1,
                    // minutes: 1,
                }),
        isRecovered: false,
    };    
    
    const user = new UserModel({
            userName: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            emailConfirmation: emailConfirmation,
            passwordRecovery: passwordRecovery,
        });
        if (login.length < 3 || login.length > 10) {
            throw new Error(API_ERRORS.login.IS_TOO_LONG.message)
        }

        return user;
    });

export const UserModel = model<User, UserModel>('users', UserSchema);
