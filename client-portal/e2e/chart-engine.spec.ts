import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const candle = (minute: number) => ({ open_time: `2026-08-07T00:${String(minute).padStart(2, "0")}:00Z`, close_time: `2026-08-07T00:${String(minute + 1).padStart(2, "0")}:00Z`, open: "100.00", high: "102.00", low: "99.00", close: "101.00", volume: "4.00", complete: true, sequence: 184200 + minute });

test("ECharts workspace, indicators, and drawings remain local and long-lived", async ({ page, request, context, baseURL }) => {
  const pageErrors: string[] = []; page.on("pageerror", (error) => pageErrors.push(error.stack || error.message));
  let snapshotRequests = 0; let capabilityRequests = 0; let newsRequests = 0;
  const origin = baseURL ?? "http://127.0.0.1:8080";
  await page.setViewportSize({ width: 1024, height: 768 });
  const session = await request.post(`${origin}/api/v1/demo/sessions`, { headers: { "Idempotency-Key": `chart-${Date.now()}` }, data: {} });
  expect(session.ok()).toBeTruthy(); const { access } = await session.json();
  await context.addCookies([{ name: "access_token", value: access, url: origin }]);
  await page.route("**/api/v1/instruments/BTC-USD/market-data-capabilities", (route) => { capabilityRequests += 1; return route.fulfill({ json: { instrument_id: "BTC-USD", timeframes: [{ interval: "5s", available: false, reason: "GENUINE_5S_SOURCE_UNAVAILABLE" }, { interval: "1m", available: true, source: "isolated-test-adapter", mode: "native" }] } }); });
  await page.route("**/api/v1/market-data/snapshot?**", (route) => { snapshotRequests += 1; return route.fulfill({ json: { instrument_id: "BTC-USD", interval: "1m", sequence: 184202, server_time: "2026-08-07T00:03:00Z", market_status: "OPEN", quote: { bid: "100.90", ask: "101.10", mid: "101.00", occurred_at: new Date().toISOString() }, candles: Array.from({ length: 40 }, (_, index) => candle(index)) } }); });
  await page.route("**/api/v1/demo/trades", (route) => route.fulfill({ json: [
    { id: "up-active", symbol: "BTCUSDT", direction: "up", amount: "100", state: "OPEN", openingPrice: "101.00", openedAt: "2026-08-07T00:00:00Z", expiresAt: "2026-08-07T00:01:00Z" },
    { id: "down-active", symbol: "BTCUSDT", direction: "down", amount: "50", state: "OPEN", openingPrice: "101.00", openedAt: "2026-08-07T00:01:00Z", expiresAt: "2026-08-07T00:02:00Z" },
    { id: "won", symbol: "BTCUSDT", direction: "up", amount: "25", state: "WON", result: "WON", openingPrice: "100.00", closingPrice: "102.00", openedAt: "2026-08-07T00:02:00Z", expiresAt: "2026-08-07T00:03:00Z", settledAt: "2026-08-07T00:03:01Z" },
    { id: "lost", symbol: "BTCUSDT", direction: "down", amount: "25", state: "LOST", result: "LOST", openingPrice: "100.00", closingPrice: "102.00", openedAt: "2026-08-07T00:03:00Z", expiresAt: "2026-08-07T00:04:00Z", settledAt: "2026-08-07T00:04:01Z" },
  ] }));
  await page.route("**/api/v1/news?**", (route) => { newsRequests += 1; return route.fulfill({ status: 503, json: { code: "PROVIDER_NOT_AVAILABLE" } }); });
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  const chart = page.locator(".chart-surface canvas").first(); await expect(chart).toBeVisible();
  await page.waitForTimeout(500); if (pageErrors.length) throw new Error(`Browser errors: ${pageErrors.join(" | ")}`);
  const fiveSeconds = page.locator(".timeframe-controls button", { hasText: "5s" }); await expect(fiveSeconds).toBeDisabled(); await expect(fiveSeconds).toHaveAttribute("title", "GENUINE_5S_SOURCE_UNAVAILABLE");
  const canvas = await chart.elementHandle(); expect(canvas).toBeTruthy();
  await expect(page.locator('[data-trade-id="up-active"]')).toContainText("▲ UP · ACTIVE"); await expect(page.locator('[data-trade-id="down-active"]')).toContainText("▼ DOWN · ACTIVE");
  await expect(page.locator('[data-trade-id="won"]')).toContainText("✓ WON"); await expect(page.locator('[data-trade-id="lost"]')).toContainText("✕ LOST");
  const initialRequests = { snapshotRequests, capabilityRequests };
  expect(newsRequests).toBe(0);
  await page.getByRole("button", { name: "Open market events" }).click(); await expect(page.getByText("News feed unavailable — provider approval pending.")).toBeVisible(); expect(newsRequests).toBe(1); expect({ snapshotRequests, capabilityRequests }).toEqual(initialRequests); expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true); expect(await page.locator(".chart-surface canvas").count()).toBe(1);
  await page.getByRole("button", { name: "Close market events" }).click();
  await page.locator(".indicator-controls > summary").click();
  await page.getByLabel("SMA", { exact: true }).check(); await page.getByLabel("RSI", { exact: true }).check(); await page.getByLabel("MACD", { exact: true }).check();
  await page.getByLabel("SMA period").fill("25"); await page.getByLabel("SMA period").press("Enter");
  expect({ snapshotRequests, capabilityRequests }).toEqual(initialRequests);
  expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true);
  await page.locator(".indicator-controls > summary").click();
  await page.locator(".drawing-controls > summary").click();
  const clickChart = async (x: number, y: number) => chart.click({ position: { x, y } });
  await page.getByRole("button", { name: "Trendline", exact: true }).click(); await clickChart(180, 180); await clickChart(320, 130);
  await expect(page.getByRole("button", { name: "Delete", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Lock", exact: true }).click(); await expect(page.getByRole("button", { name: "Unlock", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Support / resistance", exact: true }).click(); await clickChart(250, 160);
  await page.getByRole("button", { name: "Vertical", exact: true }).click(); await clickChart(280, 170);
  await page.getByRole("button", { name: "Fibonacci", exact: true }).click(); await clickChart(190, 190); await clickChart(350, 110);
  await page.getByRole("button", { name: "Measure", exact: true }).click(); await clickChart(210, 200); await clickChart(360, 140);
  await page.getByRole("button", { name: "Text", exact: true }).click(); await clickChart(300, 120); await page.getByLabel("Annotation text").fill("Staging display note");
  await page.getByRole("button", { name: "Hide/show selected", exact: true }).click(); await page.getByRole("button", { name: "Hide/show selected", exact: true }).click();
  await page.getByRole("button", { name: "Clear all", exact: true }).click(); await page.getByRole("button", { name: "Undo", exact: true }).click(); await page.getByRole("button", { name: "Redo", exact: true }).click();
  expect({ snapshotRequests, capabilityRequests }).toEqual(initialRequests);
  expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true);
  await page.locator('.zoom-controls button[aria-label="Zoom chart in"]').click({ force: true });
  await page.locator(".zoom-controls button", { hasText: "Reset" }).click({ force: true });
  await page.locator(".chart-workspace").focus(); await page.keyboard.press("+"); await page.keyboard.press("-"); await page.keyboard.press("Home");
  await page.locator(".ticket-trigger").click({ force: true }); await expect(page.getByText("Demo order", { exact: true })).toBeVisible();
  expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true); expect(await page.locator(".chart-surface canvas").count()).toBe(1);
  const accessibility = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze(); expect(accessibility.violations.filter((item) => item.impact === "critical")).toEqual([]);
  await page.getByRole("button", { name: "Close demo trade ticket" }).first().click();
  await page.setViewportSize({ width: 390, height: 844 }); await page.getByRole("button", { name: "Open market events" }).click(); await expect(page.locator(".chart-event-drawer")).toHaveCSS("position", "fixed"); await page.keyboard.press("Escape"); await expect(page.locator(".chart-event-drawer")).toHaveCount(0); expect(await page.locator(".chart-surface canvas").count()).toBe(1);
});
