import { UpdateBlogDto } from '../types/update-blog-dto';
import { CreateBlogDto } from '../types/create-blog-dto';
import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogDocument, BlogModel } from './blog.entity';


@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    ) {}

    async findById(id: string): Promise<BlogDocument | null>{
        return this.blogsRepository.findById(id);
    }

    async create(dto: CreateBlogDto): Promise<string> {
        const newBlog = BlogModel.createBlog(dto);
        
        return  this.blogsRepository.create(newBlog);
    }

    async update(id: string, dto: UpdateBlogDto): Promise<void> {
        const blog = await this.blogsRepository.findById(id);

        if(!blog) {
            throw new Error('blog not found')
        }

        blog.updateBlog(dto);
        return  this.blogsRepository.update(blog);
    }

    async delete(id: string): Promise<void> {
        return  this.blogsRepository.delete(id);
    }
};
