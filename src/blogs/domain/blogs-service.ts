import { UpdateBlogDto } from '../types/update-blog-dto';
import { CreateBlogDto } from '../types/create-blog-dto';
import { BlogDBType } from '../types/blogDBtype';
import { blogsRepository } from '../repositories/blogs.repository';


export const blogsService = {
    async findById(id: string): Promise<BlogDBType | null>{
        return blogsRepository.findById(id);
    },

    async create(blogParam: CreateBlogDto): Promise<string> {
        const newBlog: BlogDBType = {
            name: blogParam.name,
            description: blogParam.description,
            websiteUrl: blogParam.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        return blogsRepository.create(newBlog);
    },

    async update(id: string, blogParam: UpdateBlogDto): Promise<void> {
        return blogsRepository.update(id, blogParam);
    },

    async delete(id: string): Promise<void> {
        return blogsRepository.delete(id);
    }
};
