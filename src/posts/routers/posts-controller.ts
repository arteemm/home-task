import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-sort-and-pagination';
import { CommentsQueryRepository } from '../../comments/repositories/comment.query.repository';
import { PostsQueryRepository } from '../repositories/post.query.repository';
import { CreatePostDto } from '../types/create-post-dto';
import { PostsService } from '../domain/posts-service';
import { UpdatePostDto } from '../types/update-post-dto';
import { getLikesInfoAddapter } from '../../comments/adapters/get-likes-info-adapter';
import { getLikesListInfoAddapter } from '../../comments/adapters/get-likes-list-info-adapter';
import { LikeStatusType } from '../../comments/types/like-status.dto';
import { PostViewModel } from '../types/post-view-model';
import { LikeOfPostViewModel } from '../types/likeOfPost-view-model';


@injectable()
export class PostsController {
    constructor(
            @inject(PostsService) protected postsService: PostsService,
            @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
            @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async getCommentListHandler(req: Request, res: Response) {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
        const postId = req.params.id.toString();

        const { items, totalCount } = await this.commentsQueryRepository.findAll(queryInput, postId);
        const itemsWithCorrectLikeStatus = await getLikesListInfoAddapter(
            postId,
            req,
            this.commentsQueryRepository,
            items,
        )

        if (totalCount === 0) {
            res.sendStatus(HttpResponceCodes.NOT_FOUND_404);
        }

        const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
        const blogViewModel = {
            pagesCount: pagesCount,
            page: +queryInput.pageNumber,
            pageSize: +queryInput.pageSize,
            totalCount: totalCount,
            items: itemsWithCorrectLikeStatus,
        };

        res.status(HttpResponceCodes.OK_200).send(blogViewModel);
    }

    async getPostListHandler(req: Request, res: Response) {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
        const userId = req.userId as string || null;
        const { items, totalCount } = await this.postsQueryRepository.findAll(queryInput);
        const likesList = await this.postsQueryRepository.findAllLikesOfPost();
        const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
        const itemsWithLikes = items?.map(item => {
            const likeListOfPost = likesList.find(l => l.postId === item.id);
            return {...item, ...likeListOfPost?.getLikesCountByPostId(userId)};
        });
        const postsViewModel = {
            pagesCount: pagesCount,
            page: +queryInput.pageNumber,
            pageSize: +queryInput.pageSize,
            totalCount: totalCount,
            items: itemsWithLikes,
        };
    
        res.status(HttpResponceCodes.OK_200).send(postsViewModel);
    }

    async getPostByIdHandler(req: Request, res: Response) {
        try {
            const id = req.params.id.toString();
            const userId = req.userId as string || null;
    
            const postViewModel = await this.postsQueryRepository.findById(id);
            const likeViewModel = await this.postsQueryRepository.getPostWithLikesByPostId(id, userId);

            res.status(HttpResponceCodes.OK_200).send({...postViewModel, ...likeViewModel});
        } catch(e: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async createPostsHandler(req: Request<{}, {}, CreatePostDto, {}>, res: Response) {
        const responce = await this.postsService.create(req.body);
        const post = await this.postsQueryRepository.findById(responce);
        const likeViewModel = await this.postsQueryRepository.getPostWithLikesByPostId(post!.id);

        return res.status(HttpResponceCodes.CREATED_201).send({...post, ...likeViewModel});
    }

    async createCommentInPostsHandler(req: Request<{ id: string }, {}, { content: string }, {}>, res: Response) {
        const userId = req.userId as string;
        const postId = req.params.id;
    
        const result = await this.postsService.creteCommentInPost(postId, userId, req.body.content);
        const comment = await this.commentsQueryRepository.findById(result);

        const likesInfo = await getLikesInfoAddapter(comment!.id, req, this.commentsQueryRepository);
        comment!.likesInfo = likesInfo;
        return res.status(HttpResponceCodes.CREATED_201).send(comment);
    }

    async updatePostHandler(req: Request<{id: string}, {}, UpdatePostDto, {}>, res: Response) {
        try {
            const id = req.params.id.toString();
    
            await this.postsService.update(id, req.body);
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        }  catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async updateLikeStatus(req: Request<{id: string}, {}, {likeStatus: LikeStatusType}, {}>, res: Response) {
        try {
            const postId = req.params.id.toString();
            const userId = req.userId as string;

            await this.postsService.updateLikeStatus(postId, userId, req.body);
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        }  catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async deletePostHandler(req: Request, res: Response) {
        try {
            const id = req.params.id.toString();
            await this.postsService.delete(id);
        
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }
}