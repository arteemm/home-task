import mongoose, { HydratedDocument, model, Model } from 'mongoose'
import { IUserDB } from '../../types/userDBInterface'

export const UserSchema = new mongoose.Schema<IUserDB>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true },
    },
    passwordRecovery: {
        recoveryCode: { type: String, required: true },
        recoveryExpirationDate: { type: Date, required: true },
        isRecovered: { type: Boolean, required: true },
    },
});

type UserModel = Model<IUserDB>;
export type UserDocument = HydratedDocument<IUserDB>;

export const UserModel = model<IUserDB, UserModel>('users', UserSchema);

