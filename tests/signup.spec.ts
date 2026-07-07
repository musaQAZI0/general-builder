import { test, expect } from "@playwright/test";
import { uniqueEmail, TEST_USER } from "./helpers/constants";
import { deleteUser, userExists } from "./helpers/db";

/**
 * SIGNUP FLOW
 * NOTE: This app has NO email verification by design, so a successful signup
 * redirects to /login?registered=1 and shows "Account created! Please log in."
 * (there is no "verify your email" step).
 */
test.describe("Signup flow", () => {
  const created: string[] = [];

  test.afterEach(async () => {
    // Clean up any users created during a test so it can be re-run.
    for (const email of created.splice(0)) await deleteUser(email);
  });

  test("successful signup redirects to login with a success message", async ({
    page,
  }) => {
    const email = uniqueEmail("signup-ok");
    created.push(email);

    await page.goto("/signup");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="phone"]').fill("+441234567890");
    await page.locator('input[name="password"]').fill("Password123!");
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Redirected to login page…
    await page.waitForURL("**/login?registered=1");
    // …with the account-created banner (app's real behavior, not email verify).
    await expect(
      page.getByText("Account created! Please log in.")
    ).toBeVisible();

    // And the user really exists in the DB.
    expect(await userExists(email)).toBe(true);
  });

  test("signup with an already-registered email shows an error", async ({
    page,
  }) => {
    // TEST_USER is seeded in global-setup, so it always exists.
    await page.goto("/signup");
    await page.locator('input[name="email"]').fill(TEST_USER.email);
    await page.locator('input[name="phone"]').fill("+441234567890");
    await page.locator('input[name="password"]').fill("Password123!");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Email already registered")).toBeVisible();
    // Should NOT navigate away from signup.
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("invalid email format shows a validation error and does not submit", async ({
    page,
  }) => {
    await page.goto("/signup");
    await page.locator('input[name="email"]').fill("not-an-email");
    await page.locator('input[name="phone"]').fill("+441234567890");
    await page.locator('input[name="password"]').fill("Password123!");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Please enter a valid email address")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("empty fields show required/validation errors", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Zod messages for empty values.
    await expect(
      page.getByText("Please enter a valid email address")
    ).toBeVisible();
    await expect(
      page.getByText("Please enter a valid phone number")
    ).toBeVisible();
    await expect(
      page.getByText("Password must be at least 6 characters")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });
});
