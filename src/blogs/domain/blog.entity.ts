import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { CreateBlogDto } from '../types/create-blog-dto';
import { UpdateBlogDto } from '../types/update-blog-dto';
import { API_ERRORS } from '../../core/constants/apiErrors';


type Blog = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

type BlogModel = Model<Blog, {}, BlogMethods> & BlogStatic;

export type BlogDocument = HydratedDocument<Blog, BlogMethods>;

export const BlogSchema = new mongoose.Schema<Blog, BlogModel>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true, default: new Date().toISOString()},
    isMembership: { type: Boolean, required: true, default: false},
});

interface BlogStatic {
    createBlog(dto: CreateBlogDto): BlogDocument;
}

interface BlogMethods {
    updateBlog(dto: UpdateBlogDto): void;
}

export class BlogEntity {
    private constructor(       
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,
    ) {}

    updateBlog(dto: UpdateBlogDto): void {
        if (dto.name.length < 1 || dto.name.length > 15) {
            throw new Error(API_ERRORS.name.IS_TOO_LONG.message)
        }

        if (dto.description.length < 1 || dto.description.length > 500) {
            throw new Error(API_ERRORS.description.IS_TOO_LONG.message)
        }

        if (dto.websiteUrl.length < 1 || dto.websiteUrl.length > 100) {
            throw new Error(API_ERRORS.websiteUrl.IS_TOO_LONG.message)
        }
        
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}

BlogSchema.loadClass(BlogEntity);

BlogSchema.static('createBlog', function(dto: CreateBlogDto): BlogDocument {
        const blog = new BlogModel({...dto, createdAt: new Date().toISOString(), isMembership: false});
        if (dto.name.length < 1 || dto.name.length > 15) {
            throw new Error(API_ERRORS.name.IS_TOO_LONG.message)
        }

        if (dto.description.length < 1 || dto.description.length > 500) {
            throw new Error(API_ERRORS.description.IS_TOO_LONG.message)
        }

        if (dto.websiteUrl.length < 1 || dto.websiteUrl.length > 100) {
            throw new Error(API_ERRORS.websiteUrl.IS_TOO_LONG.message)
        }

        return blog;
    });

export const BlogModel = model<Blog, BlogModel>('blogs', BlogSchema);