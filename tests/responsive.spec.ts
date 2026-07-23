import { test, expect, Page } from "@playwright/test";
import { login } from "./helpers/auth";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1
  );
}

// How many service cards sit in the top row (= number of grid columns).
async function topRowColumns(page: Page): Promise<number> {
  const ys = await page
    .getByTestId("service-card")
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().y));
  const minY = Math.min(...ys);
  return ys.filter((y) => Math.abs(y - minY) < 20).length;
}

test.describe("Responsive design", () => {
  test("mobile: navbar collapses into a hamburger that opens and closes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const openBtn = page.getByRole("button", { name: "Open menu" });
    const panel = page.getByTestId("mobile-menu");
    await expect(openBtn).toBeVisible();

    // Closed: the collapsed panel has ~0 height.
    // (max-height:0 clips the links; measure the panel box directly since
    // Playwright's :visible ignores overflow clipping.)
    await expect
      .poll(async () => (await panel.boundingBox())?.height ?? 0)
      .toBeLessThan(5);

    // Open -> panel expands and shows tappable links.
    await openBtn.click();
    await expect
      .poll(async () => (await panel.boundingBox())?.height ?? 0)
      .toBeGreaterThan(40);
    await expect(
      panel.getByRole("link", { name: "Request estimate" })
    ).toBeVisible();

    // Close -> panel collapses again.
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect
      .poll(async () => (await panel.boundingBox())?.height ?? 0)
      .toBeLessThan(5);
  });

  test("desktop: full nav is shown and there is no hamburger", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
    await expect(
      page.locator("header").getByRole("link", { name: "Request estimate" })
    ).toBeVisible();
  });

  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow on public pages @ ${vp.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const path of ["/", "/signup", "/login", "/forgot-password"]) {
        await page.goto(path);
        expect(
          await hasHorizontalOverflow(page),
          `${path} @ ${vp.name} should not overflow`
        ).toBe(false);
      }
    });

    test(`no horizontal overflow on protected pages @ ${vp.name}`, async ({
      page,
    }) => {
      await login(page);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const path of ["/dashboard", "/contact"]) {
        await page.goto(path);
        expect(
          await hasHorizontalOverflow(page),
          `${path} @ ${vp.name} should not overflow`
        ).toBe(false);
      }
    });
  }

  test("service cards: 1 column on mobile, 2 on tablet, 3 on desktop", async ({
    page,
  }) => {
    await login(page);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dashboard");
    expect(await topRowColumns(page)).toBe(1);

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/dashboard");
    expect(await topRowColumns(page)).toBe(2);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard");
    expect(await topRowColumns(page)).toBe(5);
  });
});
