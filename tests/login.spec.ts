import { test, expect } from "@playwright/test";
import { TEST_USER, uniqueEmail } from "./helpers/constants";
import { login } from "./helpers/auth";

/**
 * LOGIN FLOW
 * The app returns the SAME "Invalid credentials" message for both a wrong
 * password and a non-existent email (intentional — avoids revealing which
 * emails are registered).
 */
test.describe("Login flow", () => {
  test("correct credentials redirect to /dashboard", async ({ page }) => {
    await login(page); // uses seeded TEST_USER
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "Our Services" })
    ).toBeVisible();
  });

  test("wrong password shows 'Invalid credentials'", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill(TEST_USER.email);
    await page.locator('input[name="password"]').fill("WrongPassword!");
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("non-existent email shows an error", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill(uniqueEmail("ghost"));
    await page.locator('input[name="password"]').fill("Password123!");
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // Not applicable: this app has no email-verification step by design, so there
  // is no "unverified" account state to test. Documented in TEST_REPORT.md.
  test.skip("login with unverified email shows 'please verify your email'", async () => {
    // Intentionally skipped — feature not part of this app's requirements.
  });
});
