import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Must match webServer MONGODB_URI in playwright.config.ts.
export const TEST_DB_URI = "mongodb://127.0.0.1:27017/general-builder-test";

let connected = false;

export async function connectDb() {
  if (!connected) {
    await mongoose.connect(TEST_DB_URI);
    connected = true;
  }
  return mongoose.connection;
}

export async function disconnectDb() {
  if (connected) {
    await mongoose.disconnect();
    connected = false;
  }
}

const users = () => mongoose.connection.collection("users");
const quotes = () => mongoose.connection.collection("quotes");

export async function seedUser(opts: {
  email: string;
  password: string;
  phone?: string;
}) {
  await connectDb();
  const email = opts.email.toLowerCase();
  await users().deleteMany({ email });
  await users().insertOne({
    email,
    phone: opts.phone ?? "+441234567890",
    password: await bcrypt.hash(opts.password, 10),
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
  });
}

export async function deleteUser(email: string) {
  await connectDb();
  await users().deleteMany({ email: email.toLowerCase() });
}

export async function userExists(email: string): Promise<boolean> {
  await connectDb();
  const doc = await users().findOne({ email: email.toLowerCase() });
  return !!doc;
}

// Injects a reset token (hashed, as the app stores it) so we can drive the
// reset-password page with a "valid" link without intercepting real email.
export async function setResetToken(
  email: string,
  rawToken: string,
  ttlMs = 60 * 60 * 1000
) {
  await connectDb();
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  await users().updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: new Date(Date.now() + ttlMs),
      },
    }
  );
}

export async function clearAll() {
  await connectDb();
  await users().deleteMany({});
  await quotes().deleteMany({});
}

export async function latestQuote() {
  await connectDb();
  const docs = await quotes().find().sort({ _id: -1 }).limit(1).toArray();
  return docs[0] ?? null;
}
