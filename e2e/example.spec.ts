import { test, expect } from "@playwright/test";

test("app opens", async ({ page }) => {
  await page.addInitScript(() => {
    window.Telegram = {
      WebApp: {
        initData: "test-init-data",
        ready: () => {},
      },
    } as typeof window.Telegram;
  });

  await page.goto("/");

  await expect(page).toHaveTitle("Pet Platform");
});