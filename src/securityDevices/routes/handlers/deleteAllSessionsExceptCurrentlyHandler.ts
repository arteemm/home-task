import { Request, Response } from 'express';
import { securityDevicesService } from '../../../composition-root';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { SecurityDevicesViewModel } from '../../types/securityDevices-view-model';


export async function deleteAllSessionsExceptCurrentlyHandler(req: Request, res: Response<SecurityDevicesViewModel[]>) {
    const userId = req.userId as string;
    const refreshToken = req.cookies.refreshToken;

    try {
        await securityDevicesService.deleteAllSessionsExceptCurrently(userId, refreshToken)
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