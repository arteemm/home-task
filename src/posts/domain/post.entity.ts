import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { CreatePostDto } from '../types/create-post-dto';
import { UpdatePostDto } from '../types/update-post-dto';
import { API_ERRORS } from '../../core/constants/apiErrors';


type Post = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

type PostModel = Model<Post, {}, PostMethods> & PostStatic;

export type PostDocument = HydratedDocument<Post, PostMethods>;

export const PostSchema = new mongoose.Schema<Post, PostModel>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true, default: new Date().toISOString()},
});

interface PostStatic {
    createPost(dto: CreatePostDto, blogName: string): PostDocument;
}

interface PostMethods {
    updatePost(dto: UpdatePostDto): void;
}

export class PostEntity {
    private constructor(       
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,

    ) {}

    updatePost(dto: UpdatePostDto): void {
        if (dto.title.length < 1 || dto.title.length > 30) {
            throw new Error(API_ERRORS.title.IS_TOO_LONG.message)
        }

        if (dto.shortDescription.length < 1 || dto.shortDescription.length > 100) {
            throw new Error(API_ERRORS.shortDescription.IS_TOO_LONG.message)
        }

        if (dto.content.length < 1 || dto.content.length > 1000) {
            throw new Error(API_ERRORS.content.IS_TOO_LONG.message)
        }
        
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
        this.blogId = dto.blogId;
    }
}

PostSchema.loadClass(PostEntity);

PostSchema.static('createPost', function(dto: CreatePostDto, blogName: string): PostDocument {
        const post = new PostModel({...dto, blogName: blogName, createdAt: new Date().toISOString()});
        if (dto.title.length < 1 || dto.title.length > 30) {
            throw new Error(API_ERRORS.title.IS_TOO_LONG.message)
        }

        if (dto.shortDescription.length < 1 || dto.shortDescription.length > 100) {
            throw new Error(API_ERRORS.shortDescription.IS_TOO_LONG.message)
        }

        if (dto.content.length < 1 || dto.content.length > 1000) {
            throw new Error(API_ERRORS.content.IS_TOO_LONG.message)
        }

        return post;
    });

export const PostModel = model<Post, PostModel>('posts', PostSchema);
