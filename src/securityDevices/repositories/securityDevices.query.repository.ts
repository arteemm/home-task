import { SecurityDevicesViewModel } from '../types/securityDevices-view-model';
import { SecurityDevicesDocument, SecurityDevicesModel } from '../infrastructure/mongoose/security.devices.shema';
import { CurrentSessions } from '../domain/security.devices.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';


@injectable()
export class SecurityDevicesQueryRepository {
    constructor() {}
    
    async findAll(userId: string): Promise<SecurityDevicesViewModel[] | null> {
        const result = await SecurityDevicesModel.findOne({userId: userId});

        if (!result) {
            return null;
        }
        return this._mapToListDevicesViewModel(result.currentSessions);
    }

    async getSessionByDeviceId(deviceId: string): Promise<SecurityDevicesViewModel | null> {
        const result = await SecurityDevicesModel.findOne({
            'currentSessions.deviceId': deviceId,
        });

        if(!result) {
            return null;
        }

        const currentSession = result.currentSessions.find((item: CurrentSessions) => item.deviceId === deviceId) as CurrentSessions;
        return this._mapTotDeviceViewModel(currentSession)
    }

    _mapToListDevicesViewModel(data: CurrentSessions[]): SecurityDevicesViewModel[] {
        return data.map((item: CurrentSessions) => {
            return {
                ip: item.ip,
                title: item.title,
                lastActiveDate: `${item.lastActiveDate}`,
                deviceId: item.deviceId,
            };
        });
    }

    _mapTotDeviceViewModel(data: CurrentSessions): SecurityDevicesViewModel {
        return {
                ip: data.ip,
                title: data.title,
                lastActiveDate: `${data.lastActiveDate}`,
                deviceId: data.deviceId,
            };
    }
};
