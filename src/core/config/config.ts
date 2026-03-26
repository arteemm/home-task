import { config } from 'dotenv';

config({
    quiet: true
});

export const appConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL as string,
    SECRET_KEY: process.env.SECRET_KEY as string,
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
};
