import mongoose, { HydratedDocument, model, Model, InferSchemaType } from 'mongoose';
import { ISecurityDevicesDB } from '../../types/securityDevicesDBinterface';
import { CurrentSessions } from '../../domain/security.devices.entity';


const CurrentSessionsSchema = new mongoose.Schema<CurrentSessions>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: Number, required: true },
    deviceId: { type: String, required: true },
    originalUrl: { type: String, required: true },
});


export const SecurityDevicesSchema = new mongoose.Schema<ISecurityDevicesDB>({
    userId: { type: String, required: true },
    currentSessions: { type: [CurrentSessionsSchema], required: true }
});


type SecurityDevicesModel = Model<ISecurityDevicesDB>;
export type SecurityDevicesDocument = HydratedDocument<ISecurityDevicesDB>;
export const SecurityDevicesModel = model<ISecurityDevicesDB, SecurityDevicesModel>('security-devices', SecurityDevicesSchema);
