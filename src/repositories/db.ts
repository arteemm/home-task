import { appConfig } from '../core/config/config';
import mongoose from 'mongoose';


const mongoURI = appConfig.MONGO_URL || 'mongodb://0.0.0.0:27017/';
const dbName = 'home-task';

export async function runDb () {
    try {
        await mongoose.connect(mongoURI + dbName);
        console.log('Connected successfully to mongo server');
    } catch {
        console.log('Can\'t connect to db');
        // await client.close();
        await mongoose.disconnect();
    }
};
