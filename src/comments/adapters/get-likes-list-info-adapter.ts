import { Request } from 'express';
import { CommentsQueryRepository } from '../repositories/comment.query.repository';
import { LikesInfo } from '../types/likes-info';
import { CommentViewModel } from '../types/commentViewModel';


export async function getLikesListInfoAddapter( 
    postId: string,
    req: Request,
    commentsQueryRepository: CommentsQueryRepository,
    items: CommentViewModel[]    
): Promise<CommentViewModel[]> {
    const userId = req.userId;
    let result: CommentViewModel[] = [];
    
    const likesList = await commentsQueryRepository.findLikesListByPostId(postId);

    if (userId) {
        result = items.map(item => {
            const likeOfComment = likesList?.find(st => item.id === st.commentId);

            const likesInfo: LikesInfo = {
                likesCount: likeOfComment!.likesListofComment!.filter(t => t.likeStatus === 'Like').length,
                dislikesCount: likeOfComment!.likesListofComment!.filter(t => t.likeStatus === 'Like').length,
                myStatus: 'None',
            }

            if (userId) {
                const userLikeStatus = likeOfComment!.likesListofComment.find(like => like.userId === userId);
                likesInfo.myStatus = userLikeStatus!.likeStatus;
                
            }

            return{
                id: item.id,
                content: item.content,
                commentatorInfo: {
                    userId: item.commentatorInfo.userId,
                    userLogin: item.commentatorInfo.userLogin,
                },
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: likesInfo.dislikesCount,
                    myStatus: likesInfo.myStatus,
                },
            }
            
        });

        return result;
    }

    result = items.map(item => {
            const likeOfComment = likesList?.find(st => item.id === st.commentId);
            const likesInfo: LikesInfo = {
                likesCount: likeOfComment!.likesListofComment!.filter(t => t.likeStatus === 'Like').length,
                dislikesCount: likeOfComment!.likesListofComment!.filter(t => t.likeStatus === 'Like').length,
                myStatus: 'None',
            }

            return{
                id: item.id,
                content: item.content,
                commentatorInfo: {
                    userId: item.commentatorInfo.userId,
                    userLogin: item.commentatorInfo.userLogin,
                },
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: likesInfo.dislikesCount,
                    myStatus: likesInfo.myStatus,
                },
            }
        });


    return result;
};
