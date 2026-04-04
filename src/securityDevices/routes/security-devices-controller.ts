import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { SecurityDevicesViewModel } from '../types/securityDevices-view-model';
import { SecurityDevicesQueryRepository } from '../repositories/securityDevices.query.repository';
import { SecurityDevicesService } from '../domain/securityDevices.service';
import { JwtService } from '../../auth/adapters/jwt.service';


@injectable()
export class SecurityDevicesController {
    constructor(
            @inject(SecurityDevicesQueryRepository) protected securityDevicesQueryRepository: SecurityDevicesQueryRepository,
            @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
            @inject(JwtService) protected jwtService: JwtService,
    ) {}

    async getDevicesHandler(req: Request, res: Response<SecurityDevicesViewModel[]>) {
        const userId = req.userId as string;
        const result = await this.securityDevicesQueryRepository.findAll(userId);
    
        if (!result) {
            throw new Error('something wrong in get Security Devices');
        }
    
        return res.status(HttpResponceCodes.OK_200).send(result);
    }

    async deleteAllSessionsExceptCurrentlyHandler(req: Request, res: Response<SecurityDevicesViewModel[]>) {
        const userId = req.userId as string;
        const refreshToken = req.cookies.refreshToken;
    
        try {
            await this.securityDevicesService.deleteAllSessionsExceptCurrently(userId, refreshToken)
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e) {
            const err = e as { message: string };
    
            if (err?.message === 'Unauthorized') {
                return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
            }
    
            console.error(e);
            throw new Error('some error in logout user');
        }
    }

    async deleteSessionByDeviceIdHandler(req: Request, res: Response<SecurityDevicesViewModel[]>) {
        const userId = req.userId as string;
        const refreshToken = req.cookies.refreshToken;
        const deviceId = req.params.deviceId.toString();
        const { iat } = await this.jwtService.getDataByToken(refreshToken);
    
        const sessionByDeviceId = await this.securityDevicesQueryRepository.getSessionByDeviceId(deviceId)
    
        if (!sessionByDeviceId) {
            return res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        }
    
        try {
            await this.securityDevicesService.deleteSession(userId, deviceId)
            return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(e) {
            const err = e as { message: string };
    
            if (err?.message === 'Unauthorized') {
                return res.sendStatus(HttpResponceCodes.NOT_AUTHORIZED_401);
            }
    
            if (err?.message === 'delete the deviceId of other user') {
                return res.sendStatus(HttpResponceCodes.FORBIDDEN_403);
            }
    
            console.error(e);
            throw new Error('some error in logout user');
        }
    }
}