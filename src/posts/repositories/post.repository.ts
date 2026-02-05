import { Post, CreatePost, ChangePost } from '../types/posts';
import { db } from '../../db/in-memory.db';


export const postsRepository = {
    findAll(): Post[] {
        return db.posts;
    },
    findById(id: string): Post | null{
        return db.posts.find((k: Post) => k.id === id) ?? null;
    },
    create(postParam: CreatePost): Post {
        const blogName = db.blogs.find(blog => blog.id === postParam.blogId)?.name || 'unknow';

        const newPost: Post = {
        id : `${+new Date()}`,
        title: postParam.title,
        shortDescription: postParam.shortDescription,
        content: postParam.content,
        blogId: postParam.blogId,
        blogName,
        };

        db.posts.push(newPost);   
        
        return newPost;
    },
    update(id: string, postParam: ChangePost): void {
        const indexInDb = db.posts.findIndex((k: Post) => k.id === id);  
        db.posts[indexInDb] = { ...db.posts[indexInDb], ...postParam};
    },
    delete(id: string): void {
        const indexInDb = db.posts.findIndex((k: Post) => k.id === id);
        db.posts.splice(indexInDb, 1);
    }
};
