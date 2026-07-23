import { MongoMemoryServer } from "mongodb-memory-server";

declare global {
  // eslint-disable-next-line no-var
  var __E2E_MONGO__: MongoMemoryServer | undefined;
}

const TEST_PORT = 27017;
const TEST_DB = "general-builder-test";

export async function startTestMongo() {
  if (global.__E2E_MONGO__) {
    return global.__E2E_MONGO__.getUri();
  }

  const server = await MongoMemoryServer.create({
    instance: {
      port: TEST_PORT,
      dbName: TEST_DB,
      ip: "127.0.0.1",
    },
  });
  global.__E2E_MONGO__ = server;
  return server.getUri(TEST_DB);
}

export async function stopTestMongo() {
  if (global.__E2E_MONGO__) {
    await global.__E2E_MONGO__.stop();
    global.__E2E_MONGO__ = undefined;
  }
}
