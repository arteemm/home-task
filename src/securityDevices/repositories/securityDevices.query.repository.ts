import { securityDevicesCollection } from '../../repositories/db';
import { SecurityDevicesViewModel } from '../types/securityDevices-view-model';
import { CurrentSessions } from '../types/securityDevicesDBtype';
import { WithId } from 'mongodb';


export const securityDevicesQueryRepository = {
    async findAll(userId: string): Promise<SecurityDevicesViewModel[] | null> {
        const result = await securityDevicesCollection.findOne({userId: userId});

        if (!result) {
            return null;
        }

        return this._mapToListDevicesViewModel(result.currentSessions);
    },

    async getSessionByDateIatDateAndDeviceId(userId: string, iat: number, deviceId: string): Promise<CurrentSessions | null> {
        const result = await securityDevicesCollection.findOne({
            userId: userId,
            'currentSessions.lastActiveDate': iat,
            'currentSessions.deviceId': deviceId,
        });

        if(!result) {
            return null;
        }

        return this._mapToDeviceSessionModel(deviceId, result.currentSessions);
    },

    async checkSessionsByUserId(userId: string): Promise<boolean> {
        const result = await securityDevicesCollection.findOne({userId: userId});

        if(!result) {
            return false;
        }

        return true;
    },

    _mapToListDevicesViewModel(data: CurrentSessions[]): SecurityDevicesViewModel[] {
        return data.map((item: CurrentSessions) => {
            return {
                ip: item.ip,
                title: item.title,
                lastActiveDate: `${item.lastActiveDate}`,
                deviceId: item.deviceId,
            };
        });
    },

    _mapToDeviceSessionModel(deviceId: string, data: CurrentSessions[]): CurrentSessions {
        return data.find((item: CurrentSessions) => item.deviceId === deviceId) as CurrentSessions;
    }
};
