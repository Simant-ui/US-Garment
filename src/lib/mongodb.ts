import mongoose from 'mongoose';
import dns from 'dns';

// Ensure SRV records for mongodb+srv:// resolve reliably across DNS environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore error if custom DNS cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/garment_us_db';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    // Disable command buffering so queries fail immediately if connection is not ready
    mongoose.set('bufferCommands', false);

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB Connected to Garment US Database');
      return mongooseInstance;
    }).catch((err) => {
      console.warn('MongoDB connection deferred (offline or URI not reachable):', err.message);
      cached!.promise = null;
      return null as any;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    return null;
  }

  return cached!.conn;
}

export default connectDB;
