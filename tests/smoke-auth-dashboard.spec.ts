import { expect, test } from "@playwright/test";

test("renders login route and reaches dashboard shell", async ({ page }) => {
  await page.goto("/login");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("ARIA Template")).toBeVisible();
});
