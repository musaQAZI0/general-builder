import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

test.describe("Contact / quote form", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/contact");
  });

  test("submits a valid quote request successfully", async ({ page }) => {
    await page.locator('input[name="name"]').fill("Jane Builder");
    await page.locator('input[name="phone"]').fill("+441234567890");
    await page.selectOption('select[name="service"]', "Painting");
    await page
      .locator('textarea[name="message"]')
      .fill("I'd like a quote to repaint the whole downstairs, please.");

    await page.getByRole("button", { name: "Submit Quote Request" }).click();

    await expect(
      page.getByText(/your quote request has been received/i)
    ).toBeVisible();
  });

  test("shows validation errors for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: "Submit Quote Request" }).click();

    await expect(page.getByText("Please enter your name")).toBeVisible();
    await expect(
      page.getByText("Please enter a valid phone number")
    ).toBeVisible();
    await expect(
      page.getByText(/describe the job/i)
    ).toBeVisible();
  });
});
