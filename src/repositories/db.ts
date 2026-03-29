import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { BlogDBType } from '../blogs/types/blogDBtype';
import { PostDBType } from '../posts/types/postDBtype';
import { IUserDB } from '../users/types//userDBInterface';
import { CommentsDBType } from '../comments/types/commentsDBtype';
import { SecurityDevicesDBtype } from '../securityDevices/types/securityDevicesDBtype';
import { RateLimitDataList } from '../auth/types/rate-limt-data';
import { appConfig } from '../core/config/config';

const mongoURI = appConfig.MONGO_URL || 'mongodb://0.0.0.0:27017';
const dbName = 'home-task';
export const client = new MongoClient(mongoURI);
const db:Db = client.db(dbName);
export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>('blogs');
export const postsCollection: Collection<PostDBType> = db.collection<PostDBType>('posts');
export const usersCollection: Collection<IUserDB> = db.collection<IUserDB>('users');
export const commentsCollection: Collection<CommentsDBType> = db.collection<CommentsDBType>('comments');
export const securityDevicesCollection: Collection<SecurityDevicesDBtype> = db.collection<SecurityDevicesDBtype>('security-devices');
export const rateLimitCollection: Collection<RateLimitDataList> = db.collection<RateLimitDataList>('rate-limit');

export async function runDb () {
    try {
        await client.connect();
        await client.db(dbName).command({ ping: 1 });
        console.log('Connected successfully to mongo server');
    } catch {
        console.log('Can\'t connect to db');
        await client.close();
    }
};
