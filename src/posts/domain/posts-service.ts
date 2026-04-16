import { PostDocument, PostModel } from './post.entity';
import { LikeOfPostModel, LikeOfPostDocument } from './like-of-post.entiy';
import { CreatePostDto } from '../types/create-post-dto';
import { UpdatePostDto } from '../types/update-post-dto';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/post.repository';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { UsersQueryRepository } from '../../users/repositories/user.query.repository';
import { CommentModel, CommentDocument } from '../../comments/domain/comment.entity';
import { LikeofCommentDocument, LikeOfCommentModel } from '../../comments/domain/like-of-comment.entity';
import { inject, injectable } from 'inversify';
import { LikeStatusType } from '../../comments/types/like-status.dto';



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
        const postId = await this.postsRepository.create(newPost);
        const newLike = LikeOfPostModel.createLikeOfPost(postId, postDto.blogId);
        await this.postsRepository.saveLike(newLike);

        return postId;
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
        return this.postsRepository.savePost(post);
    }

    async updateLikeStatus(postId: string, userId: string, dto: {likeStatus: LikeStatusType}): Promise<void> {
        const likeOfPost = await this.postsRepository.findLikeOfPostByPostId(postId);
        const user = await this.usersQueryRepository.findById(userId);

        if(!likeOfPost) {
            throw new Error('likeOfPost not found')
        }

        likeOfPost.updateLikeOfPostByUser(dto.likeStatus, userId, user!.login);
        await this.postsRepository.saveLike(likeOfPost);
    }

    async delete(id: string): Promise<void> {
        return this.postsRepository.delete(id);
    }
};
