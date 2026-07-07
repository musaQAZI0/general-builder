import { test, expect } from "@playwright/test";
import crypto from "crypto";
import { uniqueEmail, TEST_USER } from "./helpers/constants";
import { seedUser, setResetToken, deleteUser } from "./helpers/db";
import { login } from "./helpers/auth";

const GENERIC = /a password reset link has been sent/i;

test.describe("Forgot / reset password flow", () => {
  test("valid registered email shows the generic success message", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.locator('input[name="email"]').fill(TEST_USER.email);
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByText(GENERIC)).toBeVisible();
  });

  test("unregistered email shows the SAME message (no account enumeration)", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.locator('input[name="email"]').fill(uniqueEmail("nobody"));
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByText(GENERIC)).toBeVisible();
  });

  test("reset-password page with no token shows 'Invalid link'", async ({
    page,
  }) => {
    await page.goto("/reset-password");
    await expect(
      page.getByRole("heading", { name: "Invalid link" })
    ).toBeVisible();
  });

  test("reset-password with an invalid/expired token shows an error", async ({
    page,
  }) => {
    await page.goto("/reset-password?token=this-token-does-not-exist");
    await page.locator('input[name="password"]').fill("BrandNewPass1");
    await page.locator('input[name="confirmPassword"]').fill("BrandNewPass1");
    await page.getByRole("button", { name: "Reset password" }).click();

    await expect(
      page.getByText(/invalid or has expired/i)
    ).toBeVisible();
  });

  test("successful reset with a valid token, then login with the new password", async ({
    page,
  }) => {
    // Dedicated user so parallel projects don't interfere with each other.
    const email = uniqueEmail("reset-ok");
    const NEW_PASSWORD = "FreshPass456!";
    await seedUser({ email, password: "OldPassword1" });

    // Inject a valid reset token exactly as the app would store it.
    const rawToken = crypto.randomBytes(32).toString("hex");
    await setResetToken(email, rawToken);

    await page.goto(`/reset-password?token=${rawToken}`);
    await page.locator('input[name="password"]').fill(NEW_PASSWORD);
    await page.locator('input[name="confirmPassword"]').fill(NEW_PASSWORD);
    await page.getByRole("button", { name: "Reset password" }).click();

    await expect(page.getByText(/password has been reset/i)).toBeVisible();
    // Auto-redirects to /login?reset=1.
    await page.waitForURL("**/login?reset=1");

    // The new password now works end-to-end.
    await login(page, email, NEW_PASSWORD);
    await expect(page).toHaveURL(/\/dashboard$/);

    await deleteUser(email);
  });
});
