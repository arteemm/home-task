import { PostDocument, PostModel } from './post.entity';
import { CreatePostDto } from '../types/create-post-dto';
import { UpdatePostDto } from '../types/update-post-dto';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/post.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { UsersQueryRepository } from '../../users/repositories/user.query.repository';
import { CommentModel, CommentDocument } from '../../comments/domain/comment.entity';
import { LikeofCommentDocument, LikeOfCommentModel } from '../../comments/domain/like-of-comment.entity';
import { inject, injectable } from 'inversify';


@injectable()
export class PostsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(CommentRepository) protected commentRepository: CommentRepository,
    ) {}

    async findById(id: string):  Promise<PostDocument | null>{
        return this.postsRepository.findById(id);
    }

    async create(postDto: CreatePostDto): Promise<string> {
        const blog = await this.blogsRepository.findById(postDto.blogId);
        const blogName = `${blog?.name}`;

        const newPost = PostModel.createPost(postDto, blogName);

        return this.postsRepository.create(newPost); 
    }

    async creteCommentInPost(
        postId: string,
        userId: string,
        content: string,
    ) {
        try {
            const user = await this.usersQueryRepository.findById(userId);
            const newComment = CommentModel.createComment(content, userId, user!.login, postId);
            const commentId = await this.commentRepository.saveComment(newComment);
            const newLike = LikeOfCommentModel.createLikeOfComment(commentId, 'None', postId, userId);
            await this.commentRepository.saveLike(newLike);

            return commentId;
        } catch(e: unknown) {
            console.error('something wrongg in create comment service');
            throw new Error('something wrongg in create comment service');
        }
    }

    async update(id: string, dto: UpdatePostDto): Promise<void> {
        const post = await this.postsRepository.findById(id);

        if(!post) {
            throw new Error('post not found')
        }

        post.updatePost(dto);
        return this.postsRepository.update(post);
    }

    async delete(id: string): Promise<void> {
        return this.postsRepository.delete(id);
    }
};
