import { expect, test } from "@playwright/test";

test("homepage renders modern public UI and logo", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Flint LTD home" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Transforming/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Request estimate/i })).toBeVisible();
  await expect(page.locator("#services")).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.getByText("Client and business support")).toBeVisible();
});

test("contact page exposes accounts details", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("heading", { name: "Invoice and payment queries" })).toBeVisible();
  const accountsCard = page.getByRole("complementary");
  await expect(accountsCard.getByRole("link", { name: /07440/ })).toBeVisible();
  await expect(accountsCard.getByRole("link", { name: "flintlimited.co@gmail.com" })).toBeVisible();
  await expect(accountsCard.getByText("17166164")).toBeVisible();
});

test("mobile header menu opens", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "Mobile Chrome", "Mobile menu is hidden on desktop layouts.");
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByTestId("mobile-menu")).toContainText("Client login");
  await expect(page.getByTestId("mobile-menu")).toContainText("Request estimate");
});

test("favicon and generated logo asset are served", async ({ request }) => {
  const favicon = await request.get("/icon.png");
  expect(favicon.ok()).toBeTruthy();
  expect(favicon.headers()["content-type"]).toContain("image/png");

  const logo = await request.get("/flint-logo-ai.png");
  expect(logo.ok()).toBeTruthy();
  expect(logo.headers()["content-type"]).toContain("image/png");
});
