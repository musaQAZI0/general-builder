import { clearAll, disconnectDb } from "./helpers/db";

/** Cleans the test database after the whole suite finishes. */
async function globalTeardown() {
  await clearAll();
  await disconnectDb();
  console.log("🧹 Test DB cleaned");
}

export default globalTeardown;
