import { Request, Response } from 'express';
import { userService } from '../../../composition-root';
import { usersQueryRepository } from '../../repositories/user.query.repository';
import { UserViewModel } from '../../types/user-view-model';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';


export async function deleteUser(req: Request<{id: string}, {}, {}, {}>, res: Response<UserViewModel>) {
    try {
        const id = req.params.id;
        const user = await usersQueryRepository.findById(id);

        if (!user) {
            return res.status(HttpResponceCodes.NOT_FOUND_404);
        }

        userService.deleteUser(id);
        return res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
    } catch(e: unknown) {
        console.log(e);
        throw new Error('some error in deleteUserRoute');
    }
};
