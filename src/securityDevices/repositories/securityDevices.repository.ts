import { SecurityDevicesDBtype, CurrentSessions } from '../types/securityDevicesDBtype';
import { WithId, ObjectId, Collection } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';


export class SecurityDevicesRepository {
    constructor(private securityDevicesCollection: Collection<SecurityDevicesDBtype>) {}

    async createSession(newEntity: SecurityDevicesDBtype): Promise<string> {
        const insertResalt = await this.securityDevicesCollection.insertOne(newEntity);

        return insertResalt.insertedId.toString();
    }

    async addSession(userId: string, newSession: CurrentSessions): Promise<void> {

        const result = await this.securityDevicesCollection.updateOne({userId: userId}, {
                $push: {currentSessions: newSession}
            });

        if (result.modifiedCount === 0) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async deleteSession(userId: string, deviceId: string): Promise<void> {
        const result = await this.securityDevicesCollection.updateOne({userId: userId}, {
            $pull: {
                currentSessions: { deviceId: deviceId }
            }
        })

        if (result.modifiedCount === 0) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async deleteAllSessionsExceptCurrently(userId: string, deviceId: string): Promise<void> {
        const sessions = await this.securityDevicesCollection.findOne({
            userId: userId,
            'currentSessions.deviceId': deviceId,
        });

        const currentSession = sessions!.currentSessions.find((item: CurrentSessions) => item.deviceId === deviceId) as CurrentSessions;

        const result = await this.securityDevicesCollection.updateOne({userId: userId}, {
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
            const result = await this.securityDevicesCollection.updateOne({userId: userId, 'currentSessions.deviceId': data.deviceId}, {
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
        const result = await this.securityDevicesCollection.findOne({userId: userId});
        if(!result) {
            return false;
        }

        return true;
    }

    async getSessionByDateIatDateAndDeviceId(userId: string, iat: number, deviceId: string): Promise<CurrentSessions | null> {
        const result = await this.securityDevicesCollection.findOne({
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
        const result = await this.securityDevicesCollection.findOne({
            userId: userId,
            'currentSessions.deviceId': deviceId,
        });

        if(!result) {
            return false;
        }

        return true;
    }
}