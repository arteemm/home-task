import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { Blog } from '../blogs/types/blogs';
import { Post } from '../posts/types/posts';


dotenv.config();

 //  const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';
 const mongoURI = 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoURI);
const db:Db = client.db('home-task');
export const blogCollection: Collection<Blog> = db.collection<Blog>('blogs');
export const postsCollection: Collection<Post> = db.collection<Post>('posts');


export async function runDb () {
    try {
        await client.connect();
        await client.db('posts').command({ ping: 1 });
        console.log('Connected successfully to mongo server');
    } catch {
        console.log('Can\'t connect to db');
        await client.close();
    }
};
