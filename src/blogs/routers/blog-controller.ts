import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BlogsService } from '../domain/blogs-service';
import { BlogsQueryRepository } from '../repositories/blogs.query.repositories';
import { CreateBlogDto } from '../types/create-blog-dto';
import { BlogViewModel } from '../types/blog-view-model';
import { HttpResponceCodes } from '../../core/constants/responseCodes';
import { BlogQueryInput } from '../types/blog-query-input';
import { setDefaultSortAndPaginationIfNotExist } from '../../core/helpers/set-default-sort-and-pagination';
import { UpdateBlogDto } from '../types/update-blog-dto';
import { PostsService } from '../../posts/domain/posts-service';
import { PostsQueryRepository } from '../../posts/repositories/post.query.repository';
import { PostQueryInput } from '../../posts/types/post-query-input';


@injectable()
export class BlogController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsService) protected postsService: PostsService,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    ) {}

    async getBlogListHandler(req: Request<{}, {}, {}, BlogQueryInput>, res: Response) {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    
        const { items, totalCount } = await this.blogsQueryRepository.findAll(queryInput);
    
        const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
        const blogViewModel = {
            pagesCount: pagesCount,
            page: +queryInput.pageNumber,
            pageSize: +queryInput.pageSize,
            totalCount: totalCount,
            items,
        };
    
        res.status(HttpResponceCodes.OK_200).send(blogViewModel);
    }

    async getBlogByIdHandler(req: Request, res: Response) {
        try {
            const id = req.params.id.toString();
    
            const blogViewModel = await this.blogsQueryRepository.findById(id);
            res.status(HttpResponceCodes.OK_200).send(blogViewModel);
        } catch(e: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async getPostsListInBlogHandler(req: Request<{id: string}, {}, {}, PostQueryInput>, res: Response) {
        const blogId = req.params.id.toString();
    
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
        const { items, totalCount } = await this.postsQueryRepository.findAll(queryInput, blogId);
    
        const pagesCount = Math.ceil(totalCount / +queryInput.pageSize);
        const blogViewModel = {
            pagesCount: pagesCount,
            page: +queryInput.pageNumber,
            pageSize: +queryInput.pageSize,
            totalCount: totalCount,
            items,
            };
    
        res.status(HttpResponceCodes.OK_200).send(blogViewModel);
    }

    async createBlogHandler(req: Request<{}, {}, CreateBlogDto>, res: Response<BlogViewModel>) {
        try {
            const result = await this.blogsService.create(req.body);
            const blogViewModel = await this.blogsQueryRepository.findById(result) as BlogViewModel;
    
            return res.status(HttpResponceCodes.CREATED_201).send(blogViewModel);
        } catch(e: unknown) {
            console.error(e);
            return;
        }
    }

    async createPostInBlogHandler(req: Request, res: Response) {
        const blogId = req.params.id.toString();
    
        const insertResult  = await this.postsService.create({
            ...req.body,
            blogId
        });
        
        const postViewModel = await this.postsQueryRepository.findById(insertResult);
        return res.status(HttpResponceCodes.CREATED_201).send(postViewModel);
    }

    async updateBlogHandler(req: Request<{id: string}, {}, UpdateBlogDto>, res: Response) {
        try {
            const id = req.params.id.toString();
    
            await this.blogsService.update(id, req.body);
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        }  catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }

    async deleteBlogHandler(req: Request, res: Response) {
        try {
            const id = req.params.id.toString();
    
            await this.blogsService.delete(id);
            res.sendStatus(HttpResponceCodes.NO_CONTENT_204);
        } catch(err: unknown) {
            res.sendStatus(HttpResponceCodes.InternalServerError);
        }
    }
}