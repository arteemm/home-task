import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { BlogDBType } from '../blogs/types/blogDBtype';
import { PostDBType } from '../posts/types/postDBtype';
import { IUserDB } from '../users/types//userDBInterface';
import { CommentsDBType } from '../comments/types/commentsDBtype';


dotenv.config();

 //  const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';
 const mongoURI = 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoURI);
const db:Db = client.db('home-task');
export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>('blogs');
export const postsCollection: Collection<PostDBType> = db.collection<PostDBType>('posts');
export const usersCollection: Collection<IUserDB> = db.collection<IUserDB>('users');
export const commentsCollection: Collection<CommentsDBType> = db.collection<CommentsDBType>('comments');

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
