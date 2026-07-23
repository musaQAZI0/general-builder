import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import { login } from "./helpers/auth";

/**
 * Captures key-flow screenshots for TEST_REPORT.md.
 * Chromium-only (skipped on other projects). Images are written to ./screenshots.
 */
test.describe("Screenshots (report assets)", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "screenshots are captured on chromium only"
  );

  test("landing (desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.screenshot({ path: "screenshots/01-landing-desktop.png", fullPage: true });
  });

  test("signup page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/signup");
    await page.screenshot({ path: "screenshots/02-signup.png", fullPage: true });
  });

  test("login page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await page.screenshot({ path: "screenshots/03-login.png", fullPage: true });
  });

  test("dashboard (desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await login(page);
    await page.goto("/dashboard");
    await page.screenshot({ path: "screenshots/04-dashboard-desktop.png", fullPage: true });
  });

  test("quote modal", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /Extensions/ }).click();
    await expect(page.getByTestId("quote-modal")).toBeVisible();
    await page.screenshot({ path: "screenshots/05-quote-modal.png" });
  });

  test("landing (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.screenshot({ path: "screenshots/06-landing-mobile.png", fullPage: true });
  });

  test("mobile menu open", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(400); // let the menu finish expanding
    await page.screenshot({ path: "screenshots/07-mobile-menu.png" });
  });
});
