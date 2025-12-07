import dotenv from 'dotenv';

dotenv.config();

export default {
    redis: {
        username: String(process.env.REDIS_USERNAME!),
        password: String(process.env.REDIS_PASSWORD!),
        host: String(process.env.REDIS_HOST!),
        port: parseInt(process.env.REDIS_PORT!) 
    },

    server: {
        protocol: process.env.SERVER_PROTOCOL,
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT
    }
}