import { Request, Response } from 'express';
import { securityDevicesQueryRepository } from '../../repositories/securityDevices.query.repository';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { SecurityDevicesViewModel } from '../../types/securityDevices-view-model';


export async function getDevicesHandler(req: Request, res: Response<SecurityDevicesViewModel[]>) {
    const userId = req.userId as string;
    const result = await securityDevicesQueryRepository.findAll(userId);

    if (!result) {
        throw new Error('something wrong in get Security Devices');
    }

    return res.status(HttpResponceCodes.OK_200).send(result);
}