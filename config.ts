import dotenv from 'dotenv';

dotenv.config();

export default {
    redis: {
        username: process.env.REDIS_USERNAME?.toString(),
        password: process.env.REDIS_PASSWORD?.toString(),
        host: process.env.REDIS_HOST!.toString(),
        port: parseInt(process.env.REDIS_PORT!) 
    },

    server: {
        protocol: process.env.SERVER_PROTOCOL?.toString(),
        host: process.env.SERVER_HOST?.toString(),
        port: parseInt(process.env.SERVER_PORT!)
    },

    mongodb: {
        connectionString: process.env.MONGODB_CONNECTION_STRING?.toString()
    }
}