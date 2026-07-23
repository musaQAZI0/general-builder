import { clearAll, disconnectDb } from "./helpers/db";
import { stopTestMongo } from "./helpers/mongo-memory";

/** Cleans the test database after the whole suite finishes. */
async function globalTeardown() {
  await clearAll();
  await disconnectDb();
  await stopTestMongo();
  console.log("🧹 Test DB cleaned");
}

export default globalTeardown;
