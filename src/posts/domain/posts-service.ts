import { PostDBType } from '../types/postDBtype';
import { CreatePostDto } from '../types/create-post-dto';
import { UpdatePostDto } from '../types/update-post-dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { postsRepository } from '../repositories/post.repository';
import { commentRepository } from '../../comments/repositories/comment.repository';
import { usersQueryRepository } from '../../users/repositories/user.query.repository';
import { CommentsDBType } from '../../comments/types/commentsDBtype';


export const postsService = {
    async findById(id: string):  Promise<PostDBType | null>{
        return postsRepository.findById(id);
    },

    async create(postDto: CreatePostDto):  Promise<string> {
        const blog = await blogsRepository.findById(postDto.blogId);
        const blogName = `${blog?.name}`;

        const newPost: PostDBType = {
            title: postDto.title,
            shortDescription: postDto.shortDescription,
            content: postDto.content,
            blogId: postDto.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
        };

        return postsRepository.create(newPost); 
    },

    async creteCommentInPost(
        postId: string,
        userId: string,
        content: string,
    ) {
        try {
            const user = await usersQueryRepository.findById(userId);

            const newComment: CommentsDBType = {
                content: content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: user!.login
                },
                createdAt: new Date().toISOString(),
                postId: postId
            }

            return commentRepository.create(newComment);
        } catch(e: unknown) {
            console.error('something wrongg in create comment service');
            throw new Error('something wrongg in create comment service');
        }
    },

    async update(id: string, postParam: UpdatePostDto): Promise<void> {
        return postsRepository.update(id, postParam);
    },

    async delete(id: string): Promise<void> {
        return postsRepository.delete(id);
    }
};
