import { CreateCommentDto } from '../../../src/comments/types/create-comment-dto';


export function getCommentDto (data?: Partial<CreateCommentDto>): CreateCommentDto {
    return {
        content: data?.content || 'stringstringstringst',
    };
}