import { CreateCommentDto } from '../types/create-comment-dto';

export class Comment {
    constructor(
        public content: string,
        public commentatorInfo: CommentatorInfo,
        public createdAt: string,
        public postId: string,
    ) {}

    static create(content: string, userId: string, userLogin: string, postId: string): Comment {
        return new this(
          content,
          {
            userId: userId,
            userLogin: userLogin,
          },
          new Date().toISOString(),
          postId,
        )
    }
}

type CommentatorInfo = {
    userId: string;
    userLogin: string;
};