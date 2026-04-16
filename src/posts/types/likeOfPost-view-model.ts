import { LikeStatusType } from '../../comments/types/like-status.dto';


export type LikeOfPostViewModel = {
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusType,
        newestLikes: NewestLike[]
  }
}

export type NewestLike = {
    addedAt: string,
    userId: string,
    login: string,
}