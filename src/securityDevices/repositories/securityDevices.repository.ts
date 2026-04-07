import { ISecurityDevicesDB } from '../types/securityDevicesDBinterface';
import { SecurityDevicesModel, SecurityDevicesDocument } from '../infrastructure/mongoose/security.devices.shema';
import { CurrentSessions } from '../domain/security.devices.entity';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';


@injectable()
export class SecurityDevicesRepository {
    constructor() {}

    async createSession(newEntity: SecurityDevicesDocument): Promise<string> {
        const insertResalt = await newEntity.save();

        return insertResalt._id.toString();
    }

    async addSession(userId: string, newSession: CurrentSessions): Promise<void> {

        const result = await SecurityDevicesModel.updateOne({userId: userId}, {
                $push: {currentSessions: newSession}
            });

        if (result.modifiedCount === 0) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async deleteSession(userId: string, deviceId: string): Promise<void> {
        const result = await SecurityDevicesModel.updateOne({userId: userId}, {
            $pull: {
                currentSessions: { deviceId: deviceId }
            }
        })

        if (result.modifiedCount === 0) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async deleteAllSessionsExceptCurrently(userId: string, deviceId: string): Promise<void> {
        const sessions = await SecurityDevicesModel.findOne({
            userId: userId,
            'currentSessions.deviceId': deviceId,
        });

        const currentSession = sessions!.currentSessions.find((item: CurrentSessions) => item.deviceId === deviceId) as CurrentSessions;

        const result = await SecurityDevicesModel.updateOne({userId: userId}, {
            $set: {
                currentSessions: [currentSession]
            }
        });

        if (result.modifiedCount === 0) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async updateLastActiveDate(userId: string, data: Omit<CurrentSessions, 'title'>) {
        try {
            const result = await SecurityDevicesModel.updateOne({userId: userId, 'currentSessions.deviceId': data.deviceId}, {
                $set: {
                    'currentSessions.$.ip': data.ip,
                    'currentSessions.$.lastActiveDate': data.lastActiveDate,
                    'currentSessions.$.originalUrl': data.originalUrl,
                }
            });
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in update last active session');
        }
    }

    async checkSessionsByUserId(userId: string): Promise<boolean> {
        const result = await SecurityDevicesModel.findOne({userId: userId});
        if(!result) {
            return false;
        }

        return true;
    }

    async getSessionByDateIatDateAndDeviceId(userId: string, iat: number, deviceId: string): Promise<CurrentSessions | null> {
        const result = await SecurityDevicesModel.findOne({
            userId: userId,
            'currentSessions.lastActiveDate': iat,
            'currentSessions.deviceId': deviceId,
        });

        if(!result) {
            return null;
        }

        return result.currentSessions.find((item: CurrentSessions) => item.deviceId === deviceId) as CurrentSessions;
    }

    async checkSessionsByUserIdAndDeviceId(userId: string, deviceId: string): Promise<boolean> {
        const result = await SecurityDevicesModel.findOne({
            userId: userId,
            'currentSessions.deviceId': deviceId,
        });

        if(!result) {
            return false;
        }

        return true;
    }
}