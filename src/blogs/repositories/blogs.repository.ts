import { UpdateBlogDto } from '../types/update-blog-dto';
import { BlogDocument, BlogModel } from '../infrastructure/mongoose/blog.shema';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';


@injectable()
export class BlogsRepository {
    constructor() {}

    async findById(id: string): Promise<BlogDocument | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return BlogModel.findOne({_id: new ObjectId(id)});
    }

    async create(blog: BlogDocument): Promise<string> {
        const insertResalt = await blog.save();

        return  insertResalt._id.toString();
    }

    async update(id: string, blogParam: UpdateBlogDto): Promise<void> {
        const matchesResalt = await BlogModel.updateOne({_id: new ObjectId(id)}, {$set: {
            name: blogParam.name,
            description: blogParam.description,
            websiteUrl: blogParam.websiteUrl,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }

    async delete(id: string): Promise<void> {
        const deletedBlog = await BlogModel.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
}
