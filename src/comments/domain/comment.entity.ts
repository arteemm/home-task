import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { CreateCommentDto } from '../types/create-comment-dto';
import { API_ERRORS } from '../../core/constants/apiErrors';


type Comment = {
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    postId: string;
};

type CommentatorInfo = {
    userId: string;
    userLogin: string;
};

type CommentModel = Model<Comment, {}, CommentMethods> & CommentStatic;

export type CommentDocument = HydratedDocument<Comment, CommentMethods>;

export const CommentSchema = new mongoose.Schema<Comment>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true, default: new Date().toISOString() },
    postId: { type: String, required: true },
});

interface CommentStatic {
    createComment(content: string, userId: string, userLogin: string, postId: string): CommentDocument;
}

interface CommentMethods {
    updateBlog(content: string): void;
}

export class CommentEntity {
    private constructor(
        public content: string,
        public commentatorInfo: CommentatorInfo,
        public createdAt: string,
        public postId: string,
    ) {}

    updateCommnt(content: string): void {
        if (content.length < 20 || content.length > 300) {
            throw new Error(API_ERRORS.content.IS_TOO_LONG.message)
        }

        this.content = content;
    }
}

CommentSchema.loadClass(CommentEntity);

CommentSchema.static('createComment', function(content: string, userId: string, userLogin: string, postId: string): CommentDocument {
        const comment = new CommentModel({
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin,
            },
            postId: postId,
            createdAt: new Date().toISOString()
        });
        if (content.length < 20 || content.length > 300) {
            throw new Error(API_ERRORS.content.IS_TOO_LONG.message)
        }


        return comment;
    });

export const CommentModel = model<Comment, CommentModel>('comments', CommentSchema);