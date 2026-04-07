import { LikeStatusType } from './like-status.dto';

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusType,
}
