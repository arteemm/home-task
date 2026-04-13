import mongoose, { HydratedDocument, model, Model, InferSchemaType } from 'mongoose';
import { SessionDto } from '../types/session.dto';


type SecurityDevices = {
    userId: string,
    currentSessions: CurrentSessions[],
};

export type CurrentSessions = {
    ip: string;
    title: string;
    lastActiveDate: number;
    deviceId: string;
    originalUrl: string;
};

type SecurityDevicesModel = Model<SecurityDevices, {}, SecurityDevicesMethods> & SecurityDevicesStatic;

export type SecurityDevicesDocument = HydratedDocument<SecurityDevices, SecurityDevicesMethods>;

const CurrentSessionsSchema = new mongoose.Schema<CurrentSessions>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: Number, required: true },
    deviceId: { type: String, required: true },
    originalUrl: { type: String, required: true },
});


export const SecurityDevicesSchema = new mongoose.Schema<SecurityDevices, SecurityDevicesModel>({
    userId: { type: String, required: true },
    currentSessions: { type: [CurrentSessionsSchema], required: true }
});

interface SecurityDevicesStatic {
    createSecurityDevices(userId: string, dto: CurrentSessions): SecurityDevicesDocument;
}

interface SecurityDevicesMethods {
    // updateSecurityDevices(dto: UpdateSecurityDevicesDto): void;
}


export class SecurityDevicesEntity {
    private constructor(
        public userId: string,
        public currentSessions: CurrentSessions[],
    ) {}

}

SecurityDevicesSchema.loadClass(SecurityDevicesEntity);

SecurityDevicesSchema.static('createSecurityDevices', function(userId: string, dto: CurrentSessions): SecurityDevicesDocument {
        const currentSessions: CurrentSessions = {
            ip: dto.ip,
            title: dto.title,
            lastActiveDate: dto.lastActiveDate,
            deviceId: dto.deviceId,
            originalUrl: dto.originalUrl,
        }

        const securityDevices = new SecurityDevicesModel({userId: userId, currentSessions: [currentSessions]});

        return securityDevices;
    });

export const SecurityDevicesModel = model<SecurityDevices, SecurityDevicesModel>('security-devices', SecurityDevicesSchema);