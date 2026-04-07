import { UpdateBlogDto } from '../types/update-blog-dto';
import { CreateBlogDto } from '../types/create-blog-dto';
import { Blog } from './blog.entity';
import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogDocument, BlogModel } from '../infrastructure/mongoose/blog.shema';


@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    ) {}

    async findById(id: string): Promise<BlogDocument | null>{
        return this.blogsRepository.findById(id);
    }

    async create(blogParam: CreateBlogDto): Promise<string> {
        const newBlogInstance: Blog = Blog.create(blogParam);
        const newBlog = new BlogModel(newBlogInstance);
        
        return  this.blogsRepository.create(newBlog);
    }

    async update(id: string, blogParam: UpdateBlogDto): Promise<void> {
        return  this.blogsRepository.update(id, blogParam);
    }

    async delete(id: string): Promise<void> {
        return  this.blogsRepository.delete(id);
    }
};
