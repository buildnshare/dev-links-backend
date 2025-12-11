import mongoose from "mongoose";
import config from "../../config";

export let mongoClient: mongoose.Mongoose;

export async function startMongoClient() {
    try {
        mongoClient = await mongoose.connect(config.mongodb.connectionString!);
    } catch(err) {
        let message = err instanceof Error ? err.message : 'unexpected error';
        console.error(message);
    }
}