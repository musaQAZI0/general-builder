import mongoose from "mongoose";
import dns from "dns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Atlas `mongodb+srv://` URIs require a DNS SRV lookup. On some machines Node's
// DNS resolver is pointed at a local server (e.g. 127.0.0.1) that refuses SRV
// queries -> "querySrv ECONNREFUSED". If we detect that, fall back to public
// DNS (Cloudflare + Google) so the SRV record resolves reliably.
if (MONGODB_URI.startsWith("mongodb+srv://")) {
  try {
    const servers = dns.getServers();
    const usingLocalResolver =
      servers.length === 0 ||
      servers.every((s) => s.startsWith("127.") || s === "::1");
    if (usingLocalResolver) {
      const publicDns = ["1.1.1.1", "8.8.8.8"];
      dns.setServers(publicDns);
      // The MongoDB driver resolves SRV via the dns/promises API, which has a
      // SEPARATE resolver channel — it must be set too, or the SRV lookup still
      // hits the broken local resolver (querySrv ECONNREFUSED).
      dns.promises.setServers(publicDns);
      console.log("ℹ️  Using public DNS (1.1.1.1/8.8.8.8) for Atlas SRV lookup");
    }
  } catch {
    /* non-fatal: fall through and let the driver try the default resolver */
  }
}

// Hide any username:password in the URI before logging it (important for Atlas
// SRV strings, which embed credentials).
function redactUri(uri: string): string {
  return uri.replace(/\/\/([^:/@]+):([^@]+)@/, "//$1:****@");
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
    // Works for both local (mongodb://) and Atlas SRV (mongodb+srv://) URIs.
    // TLS/SSL is handled automatically by the driver for +srv connections — no
    // local-only options (e.g. directConnection) are set here.
    const opts = {
      bufferCommands: false,
      // Fail fast with a clear error instead of hanging if the cluster is
      // unreachable (common Atlas causes: IP not allow-listed, bad credentials).
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((m) => {
        console.log("✅ Connected to MongoDB:", redactUri(MONGODB_URI as string));
        return m;
      })
      .catch((err) => {
        // Reset the promise so the next request can retry the connection.
        cached.promise = null;
        console.error(
          "❌ MongoDB connection error. Check MONGODB_URI in .env.local. " +
            "For Atlas: confirm your IP is allow-listed (Network Access), the " +
            "username/password are correct, and the cluster is running. " +
            "For local: confirm the MongoDB service is running on 127.0.0.1:27017.",
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
