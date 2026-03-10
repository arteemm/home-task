import { commentRepository } from '../repositories/comment.repository';


export const commentsService = {
    async update(id: string, data: { content: string }): Promise<void> {
        return commentRepository.update(id, data);
    },

    async delete(id: string): Promise<void> {
        return commentRepository.delete(id);
    }
};
