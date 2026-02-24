import { Post, CreatePost, ChangePost, PostQueryInput } from '../types/posts';
import { WithId, ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { postsRepository } from '../repositories/post.repository';


export const postsService = {
    async findAll(
        queryDto: PostQueryInput,
        blogId?: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postsRepository.findAll(queryDto, blogId);
    },

    async findById(id: string):  Promise<WithId<Post> | null>{
        return postsRepository.findById(id);
    },

    async create(postParam: CreatePost):  Promise<WithId<Post>> {
        const blog = await blogsRepository.findById(postParam.blogId);
        const blogName = `${blog?.name}`;

        const newPost: Post = {
            title: postParam.title,
            shortDescription: postParam.shortDescription,
            content: postParam.content,
            blogId: postParam.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
        };

        const insertResalt = await postsRepository.create(newPost); 
        
        return {...newPost, _id: insertResalt._id};
    },

    async update(id: string, postParam: ChangePost): Promise<void> {
        return postsRepository.update(id, postParam);
    },

    async delete(id: string): Promise<void> {
        return postsRepository.delete(id);
    }
};
