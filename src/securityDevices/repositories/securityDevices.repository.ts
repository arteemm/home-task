import { SecurityDevicesDBtype, CurrentSessions } from '../types/securityDevicesDBtype';
import { WithId, ObjectId, Collection } from 'mongodb';
import { API_ERRORS } from '../../core/constants/apiErrors';


export class SecurityDevicesRepository {
    constructor(private securityDevicesCollection: Collection<SecurityDevicesDBtype>) {}

    async createSession(newEntity: SecurityDevicesDBtype): Promise<string> {
        const insertResalt = await this.securityDevicesCollection.insertOne(newEntity);

        return insertResalt.insertedId.toString();
    }

    async deleteSession(userId: string, deviceId: string): Promise<void> {
        const deletedsession = await this.securityDevicesCollection.updateOne({userId: userId}, {
            $pull: {'currentSessions.$.deviceId': deviceId}
        })

        if (deletedsession.upsertedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async updateLastActiveDate(userId: string, data: CurrentSessions) {
        try {
            await this.securityDevicesCollection.updateOne({userId: userId, 'currentSessions.$.deviceId': data.deviceId}, {
            $set: {...data}
        })
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in update last active session');
        }
    }
}