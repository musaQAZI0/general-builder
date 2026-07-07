import { clearAll, seedUser, disconnectDb } from "./helpers/db";
import { TEST_USER } from "./helpers/constants";

const BASE_URL = "http://localhost:3100";

/** Simple cookie jar for the warm-up HTTP login. */
function makeJar() {
  const jar: Record<string, string> = {};
  return {
    header: () =>
      Object.entries(jar)
        .map(([k, v]) => `${k}=${v}`)
        .join("; "),
    store: (res: Response) => {
      // node fetch exposes getSetCookie() for multiple Set-Cookie headers
      const cookies = (res.headers as unknown as { getSetCookie?: () => string[] })
        .getSetCookie?.() ?? [];
      for (const c of cookies) {
        const [pair] = c.split(";");
        const idx = pair.indexOf("=");
        jar[pair.slice(0, idx)] = pair.slice(idx + 1);
      }
    },
  };
}

/**
 * Warms up the dev server's cold code paths (NextAuth route, middleware,
 * dashboard) with a real credential login, so the first *test* login is fast
 * and deterministic instead of racing first-time compilation.
 */
async function warmUp() {
  // Wait for the dev server to be reachable (it may still be compiling).
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE_URL}/login`);
      if (r.ok) break;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  try {
    const jar = makeJar();
    // Compile middleware (redirects to /login).
    jar.store(await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" }));

    // Full credential login to compile the NextAuth authorize path.
    let res = await fetch(`${BASE_URL}/api/auth/csrf`, {
      headers: { cookie: jar.header() },
    });
    jar.store(res);
    const { csrfToken } = (await res.json()) as { csrfToken: string };

    res = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: "POST",
      redirect: "manual",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        cookie: jar.header(),
      },
      body: new URLSearchParams({
        csrfToken,
        email: TEST_USER.email,
        password: TEST_USER.password,
        callbackUrl: `${BASE_URL}/dashboard`,
      }),
    });
    jar.store(res);

    // Warm the authenticated dashboard + session endpoints.
    await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { cookie: jar.header() },
    });
    await fetch(`${BASE_URL}/dashboard`, {
      headers: { cookie: jar.header() },
      redirect: "manual",
    });
    console.log("🔥 Server warmed up (auth route + middleware compiled)");
  } catch (err) {
    console.warn("⚠️  Warm-up skipped:", (err as Error).message);
  }
}

/**
 * Runs once before the whole suite:
 *  - wipes the test database (users + quotes)
 *  - seeds the shared, known login user
 *  - warms up the dev server's cold auth paths
 */
async function globalSetup() {
  await clearAll();
  await seedUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    phone: TEST_USER.phone,
  });
  await disconnectDb();
  console.log("🌱 Test DB seeded (general-builder-test)");

  await warmUp();
}

export default globalSetup;
