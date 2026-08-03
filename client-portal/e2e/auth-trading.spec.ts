import { expect, request as apiRequest, test } from "@playwright/test";

test("registers, logs in, enters the platform, creates a demo trade, and logs out", async ({ page, request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const unique = Date.now();
  const email = `e2e-${unique}@example.test`;
  const password = "DemoTrade9!";
  const register = await request.post(`${origin}/api/user/create/`, {
    data: { email, password, first_name: "Demo", last_name: "Trader", phone_number: `+1555${String(unique).slice(-7)}` },
  });
  expect(register.ok(), `registration returned ${register.status()}`).toBeTruthy();

  const login = await request.post(`${origin}/api/user/token/`, { data: { email, password } });
  expect(login.ok(), `login returned ${login.status()}`).toBeTruthy();
  const session = await login.json();
  expect(session.access).toBeTruthy();
  expect(session.refresh).toBeTruthy();

  await context.addCookies([
    { name: "access_token", value: session.access, url: origin },
    { name: "refresh_token", value: session.refresh, url: origin },
  ]);
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/platform|\/welcome/);
  await expect(page.getByText("No Account")).toBeHidden();

  const auth = { Authorization: `Bearer ${session.access}` };
  const walletsResponse = await request.get(`${origin}/api/wallet/wallets/`, { headers: auth });
  const assetsResponse = await request.get(`${origin}/api/trades/assets/`, { headers: auth });
  const marketResponse = await request.get(
    `${origin}/api/trades/market/history/?symbol=BTCUSDT&interval=1m&limit=10`,
    { headers: auth },
  );
  expect(walletsResponse.ok(), `wallets returned ${walletsResponse.status()}`).toBeTruthy();
  expect(assetsResponse.ok(), `assets returned ${assetsResponse.status()}`).toBeTruthy();
  expect(marketResponse.ok(), `market history returned ${marketResponse.status()}`).toBeTruthy();
  const walletsPayload = await walletsResponse.json();
  const assetsPayload = await assetsResponse.json();
  const wallets = walletsPayload.results ?? walletsPayload;
  const assets = assetsPayload.results ?? assetsPayload;
  const demoWallet = wallets.find((wallet: { is_real: boolean }) => !wallet.is_real);
  expect(demoWallet).toBeTruthy();
  expect(assets.length).toBeGreaterThan(0);
  const marketPayload = await marketResponse.json();
  expect(marketPayload.results.length).toBeGreaterThan(0);

  const tradeHeaders = { ...auth, "Idempotency-Key": `e2e-${unique}` };
  const trade = await request.post(`${origin}/api/trades/`, {
    headers: tradeHeaders,
    data: {
      wallet: demoWallet.id, asset: assets[0].id, quantity: "1.0",
      price_per_unit: "1.0000", trade_type: "buy", category: "market", duration: 60,
    },
  });
  expect(trade.ok(), `trade returned ${trade.status()}: ${await trade.text()}`).toBeTruthy();
  const tradePayload = await trade.json();
  const duplicate = await request.post(`${origin}/api/trades/`, {
    headers: tradeHeaders,
    data: {
      wallet: demoWallet.id, asset: assets[0].id, quantity: "1.0",
      price_per_unit: "1.0000", trade_type: "buy", category: "market", duration: 60,
    },
  });
  expect((await duplicate.json()).id).toBe(tradePayload.id);

  const openTrades = await request.get(`${origin}/api/trades/?status=open`, { headers: auth });
  expect(openTrades.ok()).toBeTruthy();
  const cancel = await request.post(`${origin}/api/trades/${tradePayload.id}/cancel/`, { headers: auth });
  expect(cancel.ok(), `cancel returned ${cancel.status()}`).toBeTruthy();

  const deposit = await request.post(`${origin}/api/wallet/wallets/${demoWallet.id}/deposit/`, {
    headers: auth, data: { amount: 25, currency: "USD", gateway: "demo" },
  });
  expect(deposit.ok(), `demo deposit returned ${deposit.status()}`).toBeTruthy();
  const withdrawal = await request.post(`${origin}/api/wallet/wallets/${demoWallet.id}/withdraw/`, {
    headers: auth, data: { amount: 10, gateway: "demo" },
  });
  expect(withdrawal.ok(), `demo withdrawal returned ${withdrawal.status()}`).toBeTruthy();

  const portfolio = await request.get(`${origin}/api/portfolio/summary/`, { headers: auth });
  expect(portfolio.ok(), `portfolio returned ${portfolio.status()}`).toBeTruthy();
  expect((await portfolio.json()).wallets.length).toBeGreaterThan(0);
  const inbox = await request.get(`${origin}/api/notification/inbox/`, { headers: auth });
  expect(inbox.ok(), `notification inbox returned ${inbox.status()}`).toBeTruthy();
  const readAll = await request.post(`${origin}/api/notification/inbox/read-all/`, { headers: auth });
  expect(readAll.ok(), `mark all read returned ${readAll.status()}`).toBeTruthy();
  await page.screenshot({ path: "test-results/audit/03-authenticated-platform.png", fullPage: false });

  const logout = await request.post(`${origin}/api/user/token/logout/`, {
    headers: auth, data: { refresh: session.refresh },
  });
  expect(logout.ok(), `logout returned ${logout.status()}`).toBeTruthy();
  const cleanApi = await apiRequest.newContext();
  const reuse = await cleanApi.post(`${origin}/api/user/token/refresh/`, { data: { refresh: session.refresh } });
  expect(reuse.status(), `refresh reuse returned ${reuse.status()}: ${await reuse.text()}`).toBe(401);
  await cleanApi.dispose();

  await context.clearCookies();
  await page.goto("/platform");
  await expect(page).toHaveURL(/\/signIn/);
});
