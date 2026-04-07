import { Request } from 'express';
import { CommentsQueryRepository } from '../repositories/comment.query.repository';
import { LikesInfo } from '../types/likes-info';


export async function getLikesInfoAddapter(commentId: string, req: Request, commentsQueryRepository: CommentsQueryRepository): Promise<LikesInfo> {
    const userId = req.userId;
    let result: LikesInfo = {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
    };

    const comment = await commentsQueryRepository.findLikesListByCommentId(commentId);
    

    if (userId) {
        const userLikeInfo = comment?.find(item => item.userId === userId);
        if (userLikeInfo) result.myStatus = userLikeInfo.likeStatus;
    }
    

    result.likesCount = comment!.filter(item => item.likeStatus === 'Like').length;
    result.dislikesCount = comment!.filter(item => item.likeStatus === 'Dislike').length;

    return result;
};
