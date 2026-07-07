import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cached connection.
 *
 * In development, Next.js clears the Node.js module cache on every hot reload,
 * which would otherwise create a brand-new database connection on each change
 * and quickly exhaust the connection pool. We cache the connection (and the
 * in-flight connection promise) on the `global` object so it survives reloads.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };

if (!global._mongoose) {
  global._mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((m) => {
        console.log("✅ Connected to MongoDB:", MONGODB_URI);
        return m;
      })
      .catch((err) => {
        // Reset the promise so the next request can retry the connection.
        cached.promise = null;
        console.error(
          "❌ MongoDB connection error. Is your local MongoDB service running on 127.0.0.1:27017?",
          err.message
        );
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectToDatabase;
