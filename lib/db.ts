import mongoose from 'mongoose';

type dbConfig = {
    uri: string;
    dbName: string;
}

const env = process.env.NODE_ENV || 'development';
const config: dbConfig = {
    uri: process.env.MONGODB_URI || '',
    dbName: process.env.MONGODB_DB || ''
};

if (!config) {
    throw new Error(`Invalid environment: ${env}`);
}

interface CachedConnection {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
    var mongooseConnection: CachedConnection | undefined;
}
/* eslint-enable no-var */

const cached: CachedConnection = global.mongooseConnection || {
    conn: null,
    promise: null,
};

if (!global.mongooseConnection) {
    global.mongooseConnection = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: config.dbName,
        };

        cached.promise = mongoose.connect(config.uri, opts).then((mongoose) => {
            console.log(`Connected to MongoDB (${env} environment)`);
            return mongoose;
        });
    }

    try {
        const conn = await cached.promise;
        cached.conn = conn;
    } catch (e) {
        cached.promise = null;
        console.error(`MongoDB connection error (${env} environment):`, e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect; 