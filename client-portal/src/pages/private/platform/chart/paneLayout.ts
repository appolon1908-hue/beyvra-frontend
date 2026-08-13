export type PaneLayout = { priceBottom: number | string; grids: object[] };

export function calculatePaneLayout(panes: readonly string[], height: number): PaneLayout {
  if (!panes.length) return { priceBottom: 45, grids: [{ left: 12, right: 74, top: 48, bottom: 45, containLabel: true }] };
  const compact = height < 560; const lowerHeight = compact ? 72 : panes.length === 1 ? Math.min(150, height * .22) : Math.min(110, height * .16); const gap = 10;
  const lowerTotal = panes.length * lowerHeight + (panes.length - 1) * gap; const bottom = 34; const priceBottom = lowerTotal + bottom + 18;
  const grids: object[] = [{ left: 12, right: 74, top: 48, bottom: priceBottom, containLabel: true }];
  panes.forEach((_, index) => grids.push({ left: 12, right: 74, bottom: bottom + (panes.length - index - 1) * (lowerHeight + gap), height: lowerHeight, containLabel: true }));
  return { priceBottom, grids };
}
