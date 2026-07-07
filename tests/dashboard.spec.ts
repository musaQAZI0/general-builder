import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";

const SERVICES = [
  "New Extensions",
  "Refurbishment",
  "Electrical Work",
  "Plumbing Work",
  "Painting",
];

test.describe("Dashboard / services", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("all 5 service cards render with correct titles", async ({ page }) => {
    const cards = page.getByTestId("service-card");
    await expect(cards).toHaveCount(5);

    for (const name of SERVICES) {
      await expect(
        page.getByRole("heading", { name, exact: true })
      ).toBeVisible();
    }
  });

  test("'Request a Quote' opens the quote modal", async ({ page }) => {
    // Open the modal from the first service card.
    await page
      .getByTestId("service-card")
      .first()
      .getByRole("button", { name: "Request a Quote" })
      .click();

    // Modal appears with its heading and the pre-selected service.
    const modal = page.getByTestId("quote-modal");
    await expect(
      modal.getByRole("heading", { name: "Request a Quote" })
    ).toBeVisible();
    // The service subtitle is a <p> (excludes the hidden <option> of the same text).
    await expect(modal.locator("p", { hasText: "New Extensions" })).toBeVisible();

    // The quote form fields are present.
    await expect(modal.locator('input[name="name"]')).toBeVisible();
    await expect(modal.locator('textarea[name="message"]')).toBeVisible();
  });

  test("logout clears the session", async ({ page }) => {
    await logout(page);
    await expect(page).toHaveURL("http://localhost:3100/");

    // Session is gone: dashboard now redirects to login.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
