import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";

const SERVICES = [
  "Extensions",
  "Refurbishment",
  "Electrical",
  "Plumbing",
  "Painting",
];

test.describe("Dashboard / services", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("all 5 service cards render with correct titles", async ({ page }) => {
    for (const name of SERVICES) {
      await expect(
        page.getByRole("link", { name: new RegExp(name) })
      ).toBeVisible();
    }
  });

  test("new request opens the quote form", async ({ page }) => {
    await page.getByRole("link", { name: "New request" }).click();
    await expect(page).toHaveURL(/\/dashboard\/request/);

    await expect(
      page.getByRole("heading", { name: "Request a Quote" })
    ).toBeVisible();

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("logout clears the session", async ({ page }) => {
    await logout(page);
    await expect(page).toHaveURL(/\/$/);

    // Session is gone: dashboard now redirects to login.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
