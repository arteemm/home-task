import { CommentRepository } from '../repositories/comment.repository';
import { inject, injectable } from 'inversify';


injectable()
export class CommentsService {
    constructor(
        @inject(CommentRepository) protected commentRepository: CommentRepository,
    ) {}

    async update(id: string, data: { content: string }): Promise<void> {
        return this.commentRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.commentRepository.delete(id);
    }
};
