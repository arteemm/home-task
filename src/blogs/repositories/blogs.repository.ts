import { Blog, CreateBlog, ChangeBlog } from '../types/blogs';
import { db } from '../../db/in-memory.db';


export const blogsRepository = {
    findAll(): Blog[] {
        return db.blogs;
    },
    findById(id: string): Blog | null{
        return db.blogs.find((k: Blog) => k.id === id) ?? null;
    },
    create(blogParam: CreateBlog): Blog {
        const newBlog: Blog = {
            id : `${+new Date()}`,
            name: blogParam.name,
            description: blogParam.description,
            websiteUrl: blogParam.websiteUrl,
            }

        db.blogs.push(newBlog);    
        return newBlog;
    },
    update(id: string, blogParam: ChangeBlog): void {
        const indexInDb = db.blogs.findIndex((k: Blog) => k.id === id);  
        db.blogs[indexInDb] = { ...db.blogs[indexInDb], ...blogParam};
    },
    delete(id: string): void {
        const indexInDb = db.blogs.findIndex((k: Blog) => k.id === id);
        db.blogs.splice(indexInDb, 1);
    }
};
