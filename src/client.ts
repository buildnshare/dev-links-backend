
import { createClient } from 'redis';
import config from '../config'
import { ErrorMessage } from './utils';

export const client = createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: config.redis.port,
    }
});

client.on('error', err => console.error(ErrorMessage.REDIS_CLIENT_ERROR, err));

export const connectRedis = async () => {
    try {
        await client.connect();
        console.log(`redis client ${config.redis.host} connected`);
    } catch(err) {
        console.log(err);
    }
}

export const closeRedisConn = async () => {
    try {
        await client.quit();
        console.log('redis client closed');
    } catch(err) {
        console.error(err);
    }
}
  
