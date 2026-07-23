import { defineConfig, devices } from "@playwright/test";

/**
 * E2E test configuration for the General Builder site.
 *
 * Isolation strategy:
 *  - Tests run against a DEDICATED dev server on port 3100 (see webServer below),
 *    so they never collide with your normal `npm run dev` on port 3000.
 *  - That server is pointed at a SEPARATE database (general-builder-test) via
 *    the MONGODB_URI env var, so tests never touch your real data.
 *  - EMAIL_PASS is blanked so the forgot-password flow logs the reset link to the
 *    console instead of sending real Gmail messages during tests.
 */

const PORT = 3300;
const BASE_URL = `http://localhost:${PORT}`;

export const TEST_MONGODB_URI =
  "mongodb://127.0.0.1:27017/general-builder-test";

export default defineConfig({
  testDir: "./tests",
  // Global DB reset + seed of the shared login user.
  globalSetup: "./tests/global-setup.ts",
  globalTeardown: "./tests/global-teardown.ts",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // 1 retry absorbs transient first-compile timeouts from the Next.js dev server.
  retries: 1,
  // Keep workers modest so parallel DB access + 4 browser projects stay stable.
  workers: process.env.CI ? 1 : 2,

  timeout: 45_000,
  expect: { timeout: 10_000 },

  // HTML report (opens with `npx playwright show-report`) + concise console list.
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Mobile emulation to validate the responsive design (Pixel 5).
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
  ],

  // Auto-start the app on port 3100 with the test database before running tests.
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      MONGODB_URI: TEST_MONGODB_URI,
      NEXTAUTH_SECRET: "test-secret-for-e2e-only-not-for-production",
      NEXTAUTH_URL: BASE_URL,
      // Blank credentials -> reset link is console-logged, no real emails sent.
      EMAIL_USER: "",
      EMAIL_PASS: "",
    },
  },
});
