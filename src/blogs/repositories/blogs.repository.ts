import { UpdateBlogDto } from '../types/update-blog-dto';
import { BlogDBType } from '../types/blogDBtype';
import { blogCollection } from '../../repositories/db';
import { API_ERRORS } from '../../core/constants/apiErrors';
import { ObjectId } from 'mongodb';


export const blogsRepository = {
    async findById(id: string): Promise<BlogDBType | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
                res(null)
            });
        }

        return blogCollection.findOne({_id: new ObjectId(id)});
    },

    async create(newEntity: BlogDBType): Promise<string> {
        const insertResalt = await blogCollection.insertOne(newEntity);

        return  insertResalt.insertedId.toString();
    },

    async update(id: string, blogParam: UpdateBlogDto): Promise<void> {
        const matchesResalt = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            name: blogParam.name,
            description: blogParam.description,
            websiteUrl: blogParam.websiteUrl,
        }});

        if (matchesResalt.matchedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    },

    async delete(id: string): Promise<void> {
        const deletedBlog = await blogCollection.deleteOne({_id: new ObjectId(id)})

        if (deletedBlog.deletedCount < 1) {
            throw new Error(API_ERRORS.id_not_exist);
        }
    }
};
