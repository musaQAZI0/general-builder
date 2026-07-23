import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";

test.describe("Route protection", () => {
  test("accessing /dashboard while logged out redirects to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("accessing /dashboard while logged in shows the dashboard", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: /Good to see you/i })
    ).toBeVisible();
  });

  test("after logout, /dashboard redirects to /login again", async ({
    page,
  }) => {
    await login(page);
    await logout(page);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/contact is public for account and quote enquiries", async ({
    page,
  }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL(/\/contact$/);
    await expect(
      page.getByRole("heading", { name: "Invoice and payment queries" })
    ).toBeVisible();
  });
});
