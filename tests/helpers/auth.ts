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
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();

  // On success the app hard-navigates to /dashboard (window.location), which
  // reliably carries the freshly-set session cookie past the middleware.
  await page.waitForURL((u) => u.pathname === "/dashboard", { timeout: 15000 });
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
  await openMobileMenuIfPresent(page);
  // `:visible` avoids matching the hidden desktop/mobile duplicate button.
  await page.locator("button:visible", { hasText: "Logout" }).click();
  // signOut redirects to callbackUrl "/" once the session is cleared.
  await page.waitForURL((u) => u.pathname === "/", { timeout: 8000 });
  await expect(
    page.locator("a:visible", { hasText: "Sign Up" }).first()
  ).toBeVisible();
}
