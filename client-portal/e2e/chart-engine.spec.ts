import { expect, test } from "@playwright/test";

const candle = (minute: number) => ({ open_time: `2026-08-07T00:${String(minute).padStart(2, "0")}:00Z`, close_time: `2026-08-07T00:${String(minute + 1).padStart(2, "0")}:00Z`, open: "100.00", high: "102.00", low: "99.00", close: "101.00", volume: "4.00", complete: true, sequence: 184200 + minute });

test("ECharts workspace is long-lived and uncertified 5s remains disabled", async ({ page, request, context, baseURL }) => {
  const pageErrors: string[] = []; page.on("pageerror", (error) => pageErrors.push(error.message));
  let snapshotRequests = 0; let capabilityRequests = 0;
  const origin = baseURL ?? "http://127.0.0.1:8080";
  await page.setViewportSize({ width: 1024, height: 768 });
  const session = await request.post(`${origin}/api/v1/demo/sessions`, { headers: { "Idempotency-Key": `chart-${Date.now()}` }, data: {} });
  expect(session.ok()).toBeTruthy(); const { access } = await session.json();
  await context.addCookies([{ name: "access_token", value: access, url: origin }]);
  await page.route("**/api/v1/instruments/BTC-USD/market-data-capabilities", (route) => { capabilityRequests += 1; return route.fulfill({ json: { instrument_id: "BTC-USD", timeframes: [{ interval: "5s", available: false, reason: "GENUINE_5S_SOURCE_UNAVAILABLE" }, { interval: "1m", available: true, source: "isolated-test-adapter", mode: "native" }] } }); });
  await page.route("**/api/v1/market-data/snapshot?**", (route) => { snapshotRequests += 1; return route.fulfill({ json: { instrument_id: "BTC-USD", interval: "1m", sequence: 184202, server_time: "2026-08-07T00:03:00Z", market_status: "OPEN", quote: { bid: "100.90", ask: "101.10", mid: "101.00", occurred_at: new Date().toISOString() }, candles: Array.from({ length: 40 }, (_, index) => candle(index)) } }); });
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  const chart = page.locator(".chart-surface canvas").first(); await expect(chart).toBeVisible();
  await page.waitForTimeout(500); if (pageErrors.length) throw new Error(`Browser errors: ${pageErrors.join(" | ")}`);
  const fiveSeconds = page.locator(".timeframe-controls button", { hasText: "5s" }); await expect(fiveSeconds).toBeDisabled(); await expect(fiveSeconds).toHaveAttribute("title", "GENUINE_5S_SOURCE_UNAVAILABLE");
  const canvas = await chart.elementHandle(); expect(canvas).toBeTruthy();
  const initialRequests = { snapshotRequests, capabilityRequests };
  await page.locator(".indicator-controls > summary").click();
  await page.getByLabel("SMA", { exact: true }).check(); await page.getByLabel("RSI", { exact: true }).check(); await page.getByLabel("MACD", { exact: true }).check();
  await page.getByLabel("SMA period").fill("25"); await page.getByLabel("SMA period").press("Enter");
  expect({ snapshotRequests, capabilityRequests }).toEqual(initialRequests);
  expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true);
  await page.locator('.zoom-controls button[aria-label="Zoom chart in"]').click({ force: true });
  await page.locator(".zoom-controls button", { hasText: "Reset" }).click({ force: true });
  await page.locator(".ticket-trigger").click({ force: true }); await expect(page.getByText("Demo order", { exact: true })).toBeVisible();
  expect(await canvas!.evaluate((element) => element.isConnected)).toBe(true); expect(await page.locator(".chart-surface canvas").count()).toBeGreaterThan(0);
});
