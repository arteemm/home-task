import { PostDocument, PostModel } from './post.entity';
import { CreatePostDto } from '../types/create-post-dto';
import { UpdatePostDto } from '../types/update-post-dto';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/post.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { UsersQueryRepository } from '../../users/repositories/user.query.repository';
import { Comment } from '../../comments/domain/comment.entity';
import { CommentModel, CommentDocument } from '../../comments/infrastructure/mongoose/comment.shema';
import { LikeOfCommentModel } from '../../comments/infrastructure/mongoose/like-of-comment.schema';
import { LikeOfComment } from '../../comments/domain/like-of-comment.entity';
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

            const newCommentInstance: Comment = Comment.create(
                content,
                userId,
                user!.login,
                postId,
            );
            const newComment = new CommentModel(newCommentInstance);
            const commentId = await this.commentRepository.create(newComment);

            const newLikeInstance = LikeOfComment.create(
                commentId,
                'None',
                postId,
                userId
            )
            const newLike = new LikeOfCommentModel(newLikeInstance);
            this.commentRepository.createLike(newLike);

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
