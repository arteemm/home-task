import { Request, Response } from 'express';
import { securityDevicesService } from '../../../composition-root';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { SecurityDevicesViewModel } from '../../types/securityDevices-view-model';
import { securityDevicesQueryRepository } from '../../repositories/securityDevices.query.repository';
import { jwtService } from '../../../composition-root';


export async function deleteSessionByDeviceIdHandler(req: Request, res: Response<SecurityDevicesViewModel[]>) {
    const userId = req.userId as string;
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId.toString();
    const { iat } = await jwtService.getDataByToken(refreshToken);

    const sessionByDeviceId = await securityDevicesQueryRepository.getSessionByDeviceId(deviceId)

    if (!sessionByDeviceId) {
        return res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
    }

    try {
        await securityDevicesService.deleteSession(userId, deviceId)
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