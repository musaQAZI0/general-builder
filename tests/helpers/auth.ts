import { Page, expect } from "@playwright/test";
import { TEST_USER } from "./constants";

/**
 * Logs in through the real UI and waits for the dashboard.
 * Inputs are located by their `name` attribute (set by react-hook-form).
 */
export async function login(
  page: Page,
  email: string = TEST_USER.email,
  password: string = TEST_USER.password
) {
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);

    try {
      // On success the app hard-navigates to /dashboard (window.location), which
      // reliably carries the freshly-set session cookie past the middleware.
      await Promise.all([
        page.waitForURL((u) => u.pathname === "/dashboard", {
          timeout: 45_000,
          waitUntil: "domcontentloaded",
        }),
        page.getByRole("button", { name: "Login", exact: true }).click(),
      ]);
      await expect(page.getByRole("heading", { name: /Good to see you/i })).toBeVisible();
      return;
    } catch (error) {
      if (attempt === 1) {
        throw error;
      }
    }
  }
}

/** Opens the mobile hamburger menu if it is currently visible (mobile widths). */
export async function openMobileMenuIfPresent(page: Page) {
  const menuButton = page.getByRole("button", { name: "Open menu" });
  if (await menuButton.isVisible().catch(() => false)) {
    await menuButton.click();
  }
}

/** Logs out via the navbar, handling both desktop and mobile (hamburger) layouts. */
export async function logout(page: Page) {
  const csrfResponse = await page.request.get("/api/auth/csrf");
  const { csrfToken } = await csrfResponse.json();
  await page.request.post("/api/auth/signout", {
    form: {
      csrfToken,
      callbackUrl: "/",
      json: "true",
    },
  });
  await page.context().clearCookies();
  await expect.poll(async () => {
    const response = await page.request.get("/api/auth/session");
    const session = await response.json();
    return Boolean(session?.user);
  }, { timeout: 10_000 }).toBe(false);
  await page.goto("/");
  await expect(
    page.locator("a:visible", { hasText: /Request estimate|Client login/ }).first()
  ).toBeVisible();
}
