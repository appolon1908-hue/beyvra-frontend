import { expect, test, type Locator, type Page } from "@playwright/test";
import { openGuestPlatform } from "./support/session";

type Box = { x: number; y: number; width: number; height: number };

async function expectBox(locator: Locator, expected: Box, tolerance = 2) {
  const box = await locator.boundingBox();
  expect(box, `missing geometry target: ${locator}`).not.toBeNull();
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(Math.abs(box![key] - expected[key]), `${key}: ${box![key]} vs ${expected[key]}`).toBeLessThanOrEqual(tolerance);
  }
}

async function expectNoDocumentOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.clientHeight,
    scrollHeight: document.documentElement.scrollHeight,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height + 1);
}

test.describe("authoritative platform geometry", () => {
  for (const viewport of [
    { width: 1919, height: 911, rail: 100, ticket: 300 },
    { width: 1440, height: 900, rail: 100, ticket: 300 },
    { width: 1280, height: 720, rail: 80, ticket: 300 },
  ]) {
    test(`${viewport.width}x${viewport.height} desktop frame`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openGuestPlatform(page);
      const chartWidth = viewport.width - viewport.rail - viewport.ticket;
      await expectBox(page.locator(".platformWrapper"), { x: 0, y: 0, width: viewport.width, height: viewport.height });
      await expectBox(page.locator(".sidebar"), { x: 0, y: 0, width: viewport.rail, height: viewport.height });
      await expectBox(page.locator(".topbarContainer"), { x: viewport.rail, y: 0, width: viewport.width - viewport.rail, height: 91 });
      await expectBox(page.locator(".trade-graph"), { x: viewport.rail, y: 91, width: chartWidth, height: viewport.height - 91 });
      await expectBox(page.locator(".trade-ticket-shell"), { x: viewport.rail + chartWidth, y: 91, width: viewport.ticket, height: viewport.height - 91 });
      await expectNoDocumentOverflow(page);
    });
  }

  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    test(`${viewport.width}x${viewport.height} responsive frame`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openGuestPlatform(page);
      await expect(page.locator(".chart-container")).toBeVisible();
      await expectNoDocumentOverflow(page);
    });
  }
});
