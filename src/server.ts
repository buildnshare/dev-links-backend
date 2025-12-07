import express from 'express'
import cors from 'cors';
import AppRouter from './api';
import { connectRedis } from './redis/client';
import config from '../config';

const appBaseUrl = `${config.server.protocol}://${config.server.host}:${config.server.port}/`;

const app = express();
await connectRedis();

app.use(express.json())
app.use(cors())
app.use('/api', AppRouter);

app.listen(config.server.port, () => console.log(`listening on ${appBaseUrl}`));
