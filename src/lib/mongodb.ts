import mongoose from "mongoose";
import dns from "dns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

if (MONGODB_URI.startsWith("mongodb+srv://")) {
  try {
    const servers = dns.getServers();
    const usingLocalResolver =
      servers.length === 0 ||
      servers.every((server) => server.startsWith("127.") || server === "::1");

    if (usingLocalResolver) {
      const publicDns = ["1.1.1.1", "8.8.8.8"];
      dns.setServers(publicDns);
      dns.promises.setServers(publicDns);
      console.log("Using public DNS (1.1.1.1/8.8.8.8) for Atlas SRV lookup");
    }
  } catch {
    // Non-fatal: let the MongoDB driver try the default resolver.
  }
}

function redactUri(uri: string): string {
  return uri.replace(/\/\/([^:/@]+):([^@]+)@/, "//$1:****@");
}

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
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log("Connected to MongoDB:", redactUri(MONGODB_URI as string));
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error(
          "MongoDB connection error. Check MONGODB_URI. For Atlas: confirm network access, credentials, and cluster status. For local: confirm MongoDB is running.",
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
