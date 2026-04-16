import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { LikeStatusType } from '../../comments/types/like-status.dto';
import { LikeOfPostViewModel } from '../types/likeOfPost-view-model';


type LikeOfPost = {
    postId: string;
    blogId: string,
    extendedLikeOfPostInfo: ExtendedLikeOfPostInfo[];
};

export type ExtendedLikeOfPostInfo = {
    likeStatus: LikeStatusType,
    userId: string;
    userLogin: string;
    createdAt: string;
};

type LikeOfPostModel = Model<LikeOfPost, {}, LikeOfPostMethods> & LikeOfPostStatic;

export type LikeOfPostDocument = HydratedDocument<LikeOfPost, LikeOfPostMethods>;

export const ExtendedLikeOfPostInfoSchema = new mongoose.Schema<ExtendedLikeOfPostInfo>({
    likeStatus: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: String, required: true },
});

export const LikeOfPostSchema = new mongoose.Schema<LikeOfPost, LikeOfPostModel>({
    postId: { type: String, required: true },
    blogId: { type: String, required: true },
    extendedLikeOfPostInfo: [ExtendedLikeOfPostInfoSchema],
});

interface LikeOfPostStatic {
    createLikeOfPost(postId : string, blogId: string): LikeOfPostDocument;
}

interface LikeOfPostMethods {
    updateLikeOfPostByUser(likeStatus: LikeStatusType, userId: string, userLogin: string,): void;
    addLikeInfoByUserId(likeStatus: LikeStatusType, userLogin: string, userId: string): void;
    getLikesCountByPostId(userId?: string | null): LikeOfPostViewModel;
}


export class LikeOfPostEntity {
    private constructor(
        public postId: string,
        public extendedLikeOfPostInfo: ExtendedLikeOfPostInfo[],
    ) {}

    // addLikeInfoByUserId()
}

LikeOfPostSchema.loadClass(LikeOfPostEntity);

LikeOfPostSchema.method('updateLikeOfPostByUser', function(likeStatus: LikeStatusType, userId: string, userLogin: string,): void {
    let userLikeStatusIndex = this.extendedLikeOfPostInfo.findIndex(item => item.userId === userId);
  
    if (userLikeStatusIndex < 0) {
        this.extendedLikeOfPostInfo.push({
            likeStatus: likeStatus,
            userLogin: userLogin,
            userId: userId,
            createdAt: new Date().toISOString(),
        });
    
        userLikeStatusIndex = this.extendedLikeOfPostInfo.length - 1;
    }

    this.extendedLikeOfPostInfo[userLikeStatusIndex].likeStatus = likeStatus;
});

LikeOfPostSchema.method('addLikeInfoByUserId', function addLikeInfoByUserId(likeStatus: LikeStatusType, userLogin: string, userId: string): void {
    this.extendedLikeOfPostInfo.push({
            likeStatus: likeStatus,
            userLogin: userLogin,
            userId: userId,
            createdAt: new Date().toISOString(),
    })
});

LikeOfPostSchema.method('getLikesCountByPostId', function(userId?: string | null): LikeOfPostViewModel {
    const result: LikeOfPostViewModel = {
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
        }

    };

    if (userId) {
        const userLikeInfo = this.extendedLikeOfPostInfo.find(item => item.userId === userId);
        if (userLikeInfo) result.extendedLikesInfo.myStatus = userLikeInfo.likeStatus;
    }

    result.extendedLikesInfo.likesCount = this.extendedLikeOfPostInfo.filter(item => item.likeStatus === 'Like').length;
    result.extendedLikesInfo.dislikesCount = this.extendedLikeOfPostInfo.filter(item => item.likeStatus === 'Dislike').length;

    if (result.extendedLikesInfo.likesCount > 0) {
        result.extendedLikesInfo.newestLikes = this.extendedLikeOfPostInfo.slice(-3).filter(item => item.likeStatus === 'Like').reverse().map(item => {
            return {
                addedAt: item.createdAt,
                userId: item.userId,
                login: item.userLogin,
            }
        });
    }

    return result;
});

LikeOfPostSchema.static('createLikeOfPost', function(postId : string, blogId: string): LikeOfPostDocument {
        const likeOfPost = new LikeOfPostModel({postId: postId, blogId: blogId, extendedLikeOfPostInfo: []});

        return likeOfPost;
});

export const LikeOfPostModel = model<LikeOfPost, LikeOfPostModel>('like-of-post', LikeOfPostSchema);