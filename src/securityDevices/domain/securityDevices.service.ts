import { SecurityDevicesRepository } from '../repositories/securityDevices.repository';
import { securityDevicesQueryRepository } from '../repositories/securityDevices.query.repository';
import { SecurityDevicesDBtype, CurrentSessions } from '../types/securityDevicesDBtype';
import { SessionDto } from '../types/session.dto';
import { jwtService } from '../../composition-root';


export class SecurityDevicesService {
    constructor(
        protected securityDevicesRepository: SecurityDevicesRepository
    ) {}

    async createSession(userId: string, data: CurrentSessions) {
        const newSession: SecurityDevicesDBtype = {
            userId: userId,
            currentSessions: [
                {
                    ip: data.ip,
                    title: data.title,
                    lastActiveDate: data.lastActiveDate,
                    deviceId: data.deviceId,
                }
            ]
        }
        await this.securityDevicesRepository.createSession(newSession);
    }

    async deleteSession(userId: string, deviceId: string) {
        try {
            await this.securityDevicesRepository.deleteSession(userId, deviceId);
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in delete session');
        }
    }

    async updateLastActiveDate(userId: string, data: CurrentSessions) {
        try {
            await this.securityDevicesRepository.updateLastActiveDate(userId, data);
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in update last active session');
        }
    }

    async checkRefreshTokenForExist(userId: string, refreshToken: string): Promise<boolean> {
        const result = await jwtService.getDataByToken(refreshToken);

        if (!result) {
            return false;
        }

        const session = await securityDevicesQueryRepository.getSessionByDateIatDateAndDeviceId(userId, result.iat, result.deviceId);

        if (!session) {
            return false;
        }

        return true;
    }
}