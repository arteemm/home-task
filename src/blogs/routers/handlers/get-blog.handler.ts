import { Request, Response } from 'express';
import { HttpResponceCodes } from '../../../core/constants/responseCodes';
import { blogsService } from '../../domain/blogs-service';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.utils';


export async function getBlogByIdHandler(req: Request, res: Response) {
    try {
        const id = req.params.id.toString();
        const blogById = await blogsService.findById(id);

        if (blogById === null) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
            return;
        }

        const blogViewModel = mapToBlogViewModel(blogById)
        res.status(HttpResponceCodes.OK_200).send(blogViewModel);
    } catch(e: unknown) {
        res.sendStatus(HttpResponceCodes.InternalServerError);
    }
};
