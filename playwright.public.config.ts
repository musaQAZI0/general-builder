import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/public-smoke",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
