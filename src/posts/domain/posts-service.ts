import { Post } from './post.entity';
import { CreatePostDto } from '../types/create-post-dto';
import { UpdatePostDto } from '../types/update-post-dto';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/post.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { UsersQueryRepository } from '../../users/repositories/user.query.repository';
import { Comment } from '../../comments/domain/comment.entity';
import { CommentModel, CommentDocument } from '../../comments/infrastructure/mongoose/comment.shema';
import { inject, injectable } from 'inversify';
import { PostDocument, PostModel } from '../infrastructure/mongoose/post.shema';


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

    async create(postDto: CreatePostDto):  Promise<string> {
        const blog = await this.blogsRepository.findById(postDto.blogId);
        const blogName = `${blog?.name}`;

        const newPostInstance: Post = Post.create(postDto, blogName);
        const newPost = new PostModel(newPostInstance);

        return this.postsRepository.create(newPost); 
    }

    async creteCommentInPost(
        postId: string,
        userId: string,
        content: string,
    ) {
        try {
            const user = await this.usersQueryRepository.findById(userId);

            const newCommentInstance: Comment = Comment.create(
                content,
                userId,
                user!.login,
                postId,
            );
            const newComment = new CommentModel(newCommentInstance);

            return this.commentRepository.create(newComment);
        } catch(e: unknown) {
            console.error('something wrongg in create comment service');
            throw new Error('something wrongg in create comment service');
        }
    }

    async update(id: string, postParam: UpdatePostDto): Promise<void> {
        return this.postsRepository.update(id, postParam);
    }

    async delete(id: string): Promise<void> {
        return this.postsRepository.delete(id);
    }
};
