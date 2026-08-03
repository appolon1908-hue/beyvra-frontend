import { expect, test, type BrowserContext, type Page, type APIRequestContext } from "@playwright/test";

const auditDir = "test-results/dashboard-responsive-audit";

async function authenticate(
  page: Page,
  context: BrowserContext,
  request: APIRequestContext,
  baseURL?: string,
) {
  page.on("pageerror", (error) => console.error(`[browser page error] ${error.stack ?? error.message}`));
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `responsive-${unique}@example.test`;
  const password = "Responsive9!";
  const register = await request.post(`${origin}/api/user/create/`, {
    data: {
      email,
      password,
      first_name: "Mobile",
      last_name: "Auditor",
      phone_number: `+1${unique.slice(-10)}`,
    },
  });
  expect(register.ok(), `registration returned ${register.status()}`).toBeTruthy();
  const login = await request.post(`${origin}/api/user/token/`, { data: { email, password } });
  expect(login.ok(), `login returned ${login.status()}`).toBeTruthy();
  const session = await login.json();
  await context.addCookies([
    { name: "access_token", value: session.access, url: origin },
    { name: "refresh_token", value: session.refresh, url: origin },
  ]);
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible();
  await expect(page.getByText("Loading market history…")).toBeHidden({ timeout: 15_000 });
  await expect(page.getByText("Live market feed disconnected. Reconnecting…")).toBeHidden({ timeout: 15_000 });
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content, `page width ${dimensions.content}px exceeds ${dimensions.viewport}px viewport`).toBeLessThanOrEqual(
    dimensions.viewport + 1,
  );
}

test.describe("authenticated dashboard responsive audit", () => {
  test.setTimeout(120_000);
  test("desktop menus, drawers, keyboard, and layout", async ({ page, context, request, baseURL }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await authenticate(page, context, request, baseURL);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/01-desktop-platform.png` });

    for (const [index, menu] of ["Trades", "Market", "Help", "News"].entries()) {
      await page.getByRole("button", { name: menu, exact: true }).click();
      await page.waitForTimeout(350);
      await expect(page.locator(".leftMainDrawer")).toBeVisible();
      await page.screenshot({
        path: `${auditDir}/${String(index + 2).padStart(2, "0")}-desktop-${menu.toLowerCase()}.png`,
      });
      await page.locator(".leftMainDrawer button.ant-drawer-close").click();
      await expect(page.locator(".leftMainDrawer")).toBeHidden();
    }

    await page.getByRole("button", { name: "Portfolio", exact: true }).click();
    await expect(page.locator(".windowDrawer .portfolioMenu")).toBeVisible();
    await expect(page.locator(".windowDrawer").getByText("Loading portfolio…")).toBeHidden({ timeout: 15_000 });
    await expect(page.locator(".windowDrawer [role=alert]")).toHaveCount(0);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${auditDir}/06-desktop-portfolio.png` });
    await page.locator(".windowDrawer button.ant-drawer-close").click();

    const desktopProfile = page.locator(".payProfileTab:not(.payProfileTabMobile) button.profile");
    await desktopProfile.click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${auditDir}/07-desktop-profile.png` });

    await page.getByRole("button", { name: "Open notifications" }).click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${auditDir}/08-desktop-notifications.png` });

    await page.keyboard.press("Escape");
    await page.keyboard.press("Tab");
    const focusable = await page.evaluate(() => {
      const node = document.activeElement as HTMLElement | null;
      return { tag: node?.tagName, label: node?.getAttribute("aria-label") || node?.textContent?.trim() || "" };
    });
    expect(focusable.tag).not.toBe("BODY");
    await page.screenshot({ path: `${auditDir}/09-desktop-keyboard-focus.png` });
  });

  test("mobile navigation, drawers, keyboard, and reflow", async ({ page, context, request, baseURL }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticate(page, context, request, baseURL);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/10-mobile-platform.png` });

    await page.getByRole("button", { name: "Trades", exact: true }).click();
    await page.waitForTimeout(350);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/11-mobile-trades.png` });
    await page.locator(".leftMainDrawer button.ant-drawer-close").click();

    await page.getByRole("button", { name: "News", exact: true }).click();
    await page.waitForTimeout(350);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/12-mobile-news.png` });
    await page.locator(".leftMainDrawer button.ant-drawer-close").click();

    await page.getByRole("button", { name: "Open profile" }).last().click();
    await page.waitForTimeout(350);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/13-mobile-profile.png` });

    await page.getByRole("button", { name: "Open notifications" }).click();
    await page.waitForTimeout(350);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/14-mobile-notifications.png` });

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).not.toBe("BODY");
    await page.screenshot({ path: `${auditDir}/15-mobile-keyboard-focus.png` });

    await page.locator(".rightSubDrawer button.ant-drawer-close").click();
    await expect(page.locator(".rightSubDrawer")).toBeHidden();
    await page.setViewportSize({ width: 320, height: 568 });
    await expect(page.getByText("Live market feed disconnected. Reconnecting…")).toBeHidden({ timeout: 15_000 });
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/16-small-mobile-platform.png` });

    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText("Live market feed disconnected. Reconnecting…")).toBeHidden({ timeout: 15_000 });
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${auditDir}/17-tablet-platform.png` });
  });
});
