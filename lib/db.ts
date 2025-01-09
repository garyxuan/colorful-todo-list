/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:00:36
 * @Description: 
 */
import mongoose from 'mongoose';

const MONGODB_CONFIG = {
    development: {
        uri: 'mongodb://root:9lgn5rh6@dbconn.sealoshzh.site:47746/?directConnection=true',
        dbName: 'todo-list-test-db-mongodb-0'
    },
    production: {
        // uri: 'mongodb://root:jsfdx4jf@todo-list-db-mongodb.ns-g0u47zk5.svc:27017',
        // dbName: 'todo-prod'
        //暂时用一个库
        uri: 'mongodb://root:9lgn5rh6@dbconn.sealoshzh.site:47746/?directConnection=true',
        dbName: 'todo-list-test-db-mongodb-0'
    }
} as const;

const env = process.env.NODE_ENV || 'development';
const config = MONGODB_CONFIG[env as keyof typeof MONGODB_CONFIG];

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