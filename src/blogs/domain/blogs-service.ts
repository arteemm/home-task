import { Blog, CreateBlog, ChangeBlog, BlogQueryInput } from '../types/blogs';
import { WithId } from 'mongodb';
import { blogsRepository } from '../repositories/blogs.repository';


export const blogsService = {
    async findAll(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return blogsRepository.findAll(queryDto);
    },

    async findById(id: string): Promise<WithId<Blog> | null>{
        return blogsRepository.findById(id);
    },

    async create(blogParam: CreateBlog): Promise<WithId<Blog>> {
        const newBlog: Blog = {
            name: blogParam.name,
            description: blogParam.description,
            websiteUrl: blogParam.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        const insertResalt = await blogsRepository.create(newBlog);
        return {...newBlog, _id: insertResalt._id};
    },

    async update(id: string, blogParam: ChangeBlog): Promise<void> {
        return blogsRepository.update(id, blogParam);
    },

    async delete(id: string): Promise<void> {
        return blogsRepository.delete(id);
    }
};
