import express from 'express'
import cors from 'cors';
import LinkRouter from './services/link/api';
import { connectRedis } from './redis-client';
import config from '../config';
import { startMongoClient } from './db/client';
import AuthRouter from './services/auth/api';

const appBaseUrl = `${config.server.protocol}://${config.server.host}:${config.server.port}/`;

const app = express();

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

await startMongoClient();
await connectRedis();

app.use('/api', LinkRouter);
app.use('/auth', AuthRouter)

app.listen(config.server.port, () => console.log(`listening on ${appBaseUrl}`));
