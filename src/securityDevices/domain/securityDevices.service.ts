import { SecurityDevicesRepository } from '../repositories/securityDevices.repository';
import { securityDevicesQueryRepository } from '../repositories/securityDevices.query.repository';
import { SecurityDevicesDBtype, CurrentSessions } from '../types/securityDevicesDBtype';
import { JwtService } from '../../auth/adapters/jwt.service';
import { inject, injectable } from 'inversify';


@injectable()
export class SecurityDevicesService {
    constructor(
        @inject(SecurityDevicesRepository) protected securityDevicesRepository: SecurityDevicesRepository,
        @inject(JwtService) protected jwtService: JwtService
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
                    originalUrl: data.originalUrl
                }
            ]
        }
        await this.securityDevicesRepository.createSession(newSession);
    }

    async addSession(userId: string, data: CurrentSessions) {
        await this.securityDevicesRepository.addSession(userId, data);
    }

    async deleteSession(userId: string, deviceId: string) {
        try {
            const result = await this.securityDevicesRepository.checkSessionsByUserIdAndDeviceId(userId, deviceId)

            if (!result) {
                throw new Error('delete the deviceId of other user')
            }

            await this.securityDevicesRepository.deleteSession(userId, deviceId);
        } catch(e) {
            const err = e as { message: string };

            if (err?.message === 'token verify error') {
                throw new Error('Unauthorized')
            }

            if (err?.message === 'delete the deviceId of other user') {
                throw new Error('delete the deviceId of other user')
            }

            console.error(e);
            throw new Error('something wrong in delete session');
        }
    }

    async deleteAllSessionsExceptCurrently(userId: string, refreshToken: string) {
        try {
            const result = await this.jwtService.getDataByToken(refreshToken);
            await this.securityDevicesRepository.deleteAllSessionsExceptCurrently(userId, result.deviceId);
        } catch(e) {
            const err = e as { message: string };
    
            if (err?.message === 'token verify error') {
                throw new Error('Unauthorized')
            }

            console.error(e);
            throw new Error('something wrong in delete ALL sessions service');
        }
    }

    async updateLastActiveDate(userId: string, data: Omit<CurrentSessions, 'title'>) {
        try {
            await this.securityDevicesRepository.updateLastActiveDate(userId, data);
        } catch(e) {
            console.error(e);
            throw new Error('something wrong in update last active session');
        }
    }

    async checkRefreshTokenForExist(userId: string, refreshToken: string): Promise<boolean> {
        const result = await this.jwtService.getDataByToken(refreshToken);
        if (!result) {
            return false;
        }

        const session = await this.securityDevicesRepository.getSessionByDateIatDateAndDeviceId(userId, result.iat, result.deviceId);

        if (!session) {
            return false;
        }

        return true;
    }

    async checkSessionsByUserId(userId: string): Promise<boolean> {
        return this.securityDevicesRepository.checkSessionsByUserId(userId);
    }
}