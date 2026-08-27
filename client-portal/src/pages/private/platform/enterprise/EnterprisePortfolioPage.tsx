import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Link } from "react-router-dom";
import {
  enterpriseApi,
  type AllocationBucket,
  type EvidenceQuality,
  type PerformancePoint,
  type PerformanceRange,
  type PortfolioPosition,
} from "api/enterprise";
import "./enterprisePortfolio.scss";

const ranges: PerformanceRange[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

const money = (value: string | number | null | undefined, currency = "USD") => {
  if (value === null || value === undefined) return "Unavailable";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "Unavailable";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numeric);
};

const percent = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return "Unavailable";
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${(numeric * 100).toFixed(1)}%` : "Unavailable";
};

function EvidenceBadge({ quality }: { quality: EvidenceQuality }) {
  return (
    <span className={`enterprise-quality enterprise-quality--${quality.toLowerCase()}`}>
      {quality}
    </span>
  );
}

function PanelState({
  state,
  detail,
  onRetry,
}: {
  state: "LOADING" | "UNAVAILABLE";
  detail: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="enterprise-panel-state"
      role={state === "UNAVAILABLE" ? "alert" : "status"}
      aria-busy={state === "LOADING"}
    >
      <strong>{state === "LOADING" ? "Loading evidence" : "Evidence unavailable"}</strong>
      <p>{detail}</p>
      {onRetry && <button type="button" onClick={onRetry}>Retry this panel</button>}
    </div>
  );
}

function Chart({ option, label }: { option: EChartsOption; label: string }) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!element.current) return;
    const chart = echarts.init(element.current, undefined, { renderer: "canvas" });
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    chart.setOption({ ...option, animation: !reduceMotion });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div ref={element} className="enterprise-chart" role="img" aria-label={label} />;
}

export default function EnterprisePortfolioPage() {
  const [range, setRange] = useState<PerformanceRange>("1M");
  const summary = useQuery({
    queryKey: ["portfolio", "summary"],
    queryFn: enterpriseApi.portfolioSummary,
  });
  const positions = useQuery({
    queryKey: ["portfolio", "positions"],
    queryFn: enterpriseApi.portfolioPositions,
  });
  const performance = useQuery({
    queryKey: ["portfolio", "performance", range],
    queryFn: () => enterpriseApi.portfolioPerformance(range),
  });
  const allocations = useQuery({
    queryKey: ["portfolio", "allocations"],
    queryFn: enterpriseApi.portfolioAllocations,
  });
  const risk = useQuery({
    queryKey: ["portfolio", "risk"],
    queryFn: enterpriseApi.portfolioRisk,
  });
  const evidence = useQuery({
    queryKey: ["portfolio", "evidence-quality", range],
    queryFn: () => enterpriseApi.portfolioEvidenceQuality(range),
  });

  const currency = summary.data?.base_currency ?? "USD";
  const performanceOption = useMemo<EChartsOption>(() => {
    const points = performance.data?.results ?? [];
    return {
      animationDuration: 450,
      aria: { enabled: true, decal: { show: true } },
      color: ["#65e5c2"],
      grid: { left: 14, right: 16, top: 30, bottom: 22, containLabel: true },
      tooltip: { trigger: "axis", valueFormatter: (value) => money(String(value), currency) },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: points.map((point: PerformancePoint) => new Date(point.period_end).toLocaleDateString(undefined, { month: "short", day: "numeric" })),
        axisLine: { lineStyle: { color: "#293548" } },
        axisLabel: { color: "#8fa1bb", hideOverlap: true },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: { lineStyle: { color: "#1e293b" } },
        axisLabel: { color: "#8fa1bb", formatter: (value: number) => Intl.NumberFormat(undefined, { notation: "compact" }).format(value) },
      },
      series: [{
        type: "line",
        smooth: 0.22,
        symbol: "none",
        data: points.map((point: PerformancePoint) => Number(point.closing_value)),
        lineStyle: { width: 3 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [
          { offset: 0, color: "rgba(101,229,194,.32)" },
          { offset: 1, color: "rgba(101,229,194,0)" },
        ] } },
      }],
      graphic: points.length ? undefined : [{
        type: "text",
        left: "center",
        top: "middle",
        style: { text: "No verified performance history", fill: "#8fa1bb", fontSize: 14 },
      }],
    };
  }, [currency, performance.data]);

  const allocationOption = useMemo<EChartsOption>(() => {
    const buckets = allocations.data?.results ?? [];
    return {
      aria: { enabled: true, decal: { show: true } },
      color: ["#65e5c2", "#7d8cff", "#ffbe5c", "#ef6f9b", "#52a8ff"],
      tooltip: { trigger: "item", formatter: "{b}: {d}%" },
      legend: { bottom: 0, textStyle: { color: "#a9b6c9" }, itemWidth: 10, itemHeight: 10 },
      series: [{
        name: "Allocation",
        type: "pie",
        radius: ["54%", "76%"],
        center: ["50%", "43%"],
        label: { show: false },
        data: buckets.map((bucket: AllocationBucket) => ({ name: bucket.asset_class, value: Number(bucket.market_value) })),
        emptyCircleStyle: { color: "#182235" },
      }],
      graphic: buckets.length ? undefined : [{
        type: "text",
        left: "center",
        top: "40%",
        style: { text: "No priced positions", fill: "#8fa1bb", fontSize: 14 },
      }],
    };
  }, [allocations.data]);

  if (summary.isPending) {
    return <main className="enterprise-portfolio enterprise-state" aria-busy="true">Loading portfolio evidence…</main>;
  }

  if (summary.isError || !summary.data) {
    return (
      <main className="enterprise-portfolio enterprise-state" role="alert">
        <h1>Portfolio temporarily unavailable</h1>
        <p>No financial values were estimated. Retry when the portfolio authority recovers.</p>
        <button type="button" onClick={() => void summary.refetch()}>Try again</button>
      </main>
    );
  }

  const supportQueries = [positions, performance, allocations, risk, evidence];
  const partialData = supportQueries.some((query) => query.isPending || query.isError)
    || [positions.data?.quality, performance.data?.quality, allocations.data?.quality, evidence.data?.overall_quality]
      .some((quality) => quality === "PARTIAL" || quality === "UNAVAILABLE");
  const lastUpdated = new Date(summary.data.as_of).toLocaleString();
  const unpriced = allocations.data?.unpriced_instruments.length ?? 0;

  return (
    <main className="enterprise-portfolio">
      <header className="enterprise-header">
        <div>
          <p className="enterprise-eyebrow">Portfolio command center</p>
          <h1>Good to see you. Here’s your position.</h1>
          <p>Evidence as of {lastUpdated}</p>
        </div>
        <div className="enterprise-header__actions">
          {evidence.data && <EvidenceBadge quality={evidence.data.overall_quality} />}
          <span className="enterprise-simulation">Simulation</span>
          <Link className="enterprise-trade-button" to="/platform">Open trade ticket</Link>
        </div>
      </header>

      {partialData && (
        <section className="enterprise-partial" role="status">
          <strong>Partial evidence</strong>
          <span>Available values are shown with their quality. Missing data is never estimated.</span>
        </section>
      )}

      <section className="enterprise-kpis" aria-label="Portfolio totals">
        <article><span>Net equity</span><strong>{money(summary.data.equity, currency)}</strong><small>Cash + priced positions</small></article>
        <article><span>Available cash</span><strong>{money(summary.data.available_cash, currency)}</strong><small>{money(summary.data.reserved_cash, currency)} reserved</small></article>
        <article><span>Unrealized P&amp;L</span><strong className={Number(summary.data.unrealized_pnl) >= 0 ? "positive" : "negative"}>{money(summary.data.unrealized_pnl, currency)}</strong><small>{money(summary.data.realized_pnl, currency)} realized</small></article>
        <article><span>Open orders</span><strong>{risk.data?.open_orders ?? "Unavailable"}</strong><small>{positions.data?.count ?? "Unavailable"} positions</small></article>
      </section>

      <section className="enterprise-grid">
        <article className="enterprise-panel enterprise-panel--wide">
          <div className="enterprise-panel__heading">
            <div><h2>Performance</h2>{performance.data && <EvidenceBadge quality={performance.data.quality} />}</div>
            <div className="enterprise-range" aria-label="Performance range">
              {ranges.map((item) => (
                <button
                  type="button"
                  className={item === range ? "active" : ""}
                  aria-pressed={item === range}
                  onClick={() => setRange(item)}
                  key={item}
                >{item}</button>
              ))}
            </div>
          </div>
          {performance.isPending && <PanelState state="LOADING" detail="Loading persisted performance snapshots." />}
          {performance.isError && <PanelState state="UNAVAILABLE" detail="Performance history could not be verified." onRetry={() => void performance.refetch()} />}
          {performance.data && (
            <>
              <Chart option={performanceOption} label={`Verified portfolio performance for ${range}; quality ${performance.data.quality}`} />
              <table className="enterprise-chart-data">
                <caption>Performance data</caption>
                <thead><tr><th>Date</th><th>Closing value</th><th>P&amp;L</th></tr></thead>
                <tbody>{performance.data.results.map((point: PerformancePoint) => <tr key={point.period_end}><td>{new Date(point.period_end).toLocaleDateString()}</td><td>{money(point.closing_value, currency)}</td><td>{money(point.pnl, currency)}</td></tr>)}</tbody>
              </table>
            </>
          )}
        </article>

        <article className="enterprise-panel">
          <div className="enterprise-panel__heading"><div><h2>Allocation</h2>{allocations.data && <EvidenceBadge quality={allocations.data.quality} />}</div></div>
          {allocations.isPending && <PanelState state="LOADING" detail="Loading verified allocation evidence." />}
          {allocations.isError && <PanelState state="UNAVAILABLE" detail="Allocation could not be calculated from verified prices." onRetry={() => void allocations.refetch()} />}
          {allocations.data && <Chart option={allocationOption} label={`Portfolio allocation by asset class; quality ${allocations.data.quality}`} />}
          {allocations.data && unpriced > 0 && <p className="enterprise-warning">{unpriced} instrument{unpriced === 1 ? " is" : "s are"} excluded because verified pricing is unavailable.</p>}
        </article>

        <article className="enterprise-panel enterprise-panel--positions">
          <div className="enterprise-panel__heading"><div><h2>Positions</h2>{positions.data && <EvidenceBadge quality={positions.data.quality} />}</div><span>{positions.data?.count ?? "—"} total</span></div>
          {positions.isPending && <PanelState state="LOADING" detail="Loading canonical positions and valuation evidence." />}
          {positions.isError && <PanelState state="UNAVAILABLE" detail="Positions could not be verified." onRetry={() => void positions.refetch()} />}
          {positions.data && (
            <div className="enterprise-table-scroll">
              <table>
                <thead><tr><th>Instrument</th><th>Quantity</th><th>Market value</th><th>Unrealized P&amp;L</th><th>Price quality</th></tr></thead>
                <tbody>
                  {positions.data.results.length === 0 && <tr><td colSpan={5}>No simulation positions yet.</td></tr>}
                  {positions.data.results.map((position: PortfolioPosition) => <tr key={position.id}>
                    <td><strong>{position.symbol}</strong><small>{position.asset_class}</small></td>
                    <td>{position.quantity}</td>
                    <td>{money(position.market_value, currency)}</td>
                    <td className={position.unrealized_pnl === null ? "" : Number(position.unrealized_pnl) >= 0 ? "positive" : "negative"}>{money(position.unrealized_pnl, currency)}</td>
                    <td>{position.price_quality}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <aside className="enterprise-panel enterprise-risk">
          <div className="enterprise-panel__heading"><div><h2>Risk snapshot</h2>{risk.data && <EvidenceBadge quality={risk.data.valuation_quality} />}</div></div>
          {risk.isPending && <PanelState state="LOADING" detail="Loading explainable exposure metrics." />}
          {risk.isError && <PanelState state="UNAVAILABLE" detail="Risk evidence could not be verified; no metric was estimated." onRetry={() => void risk.refetch()} />}
          {risk.data && (
            <>
              <dl>
                <div><dt>Gross exposure</dt><dd>{percent(risk.data.gross_exposure_ratio)}</dd></div>
                <div><dt>Net exposure</dt><dd>{money(risk.data.net_exposure, currency)}</dd></div>
                <div><dt>Largest position</dt><dd>{percent(risk.data.largest_position_ratio)}</dd></div>
                <div><dt>Cash buffer</dt><dd>{percent(risk.data.cash_ratio)}</dd></div>
                <div><dt>Value at risk</dt><dd>{risk.data.value_at_risk ?? "Unavailable"}</dd></div>
                <div><dt>Stress loss</dt><dd>{risk.data.stress_loss ?? "Unavailable"}</dd></div>
              </dl>
              <p>Gross exposure is the sum of absolute priced positions. VaR and stress remain unavailable until certified history, methodology and policy evidence are approved.</p>
            </>
          )}
        </aside>
      </section>

      <nav className="enterprise-mobile-nav" aria-label="Primary navigation">
        <Link to="/platform">Home</Link><Link to="/platform/market">Markets</Link><Link className="trade" to="/platform">Trade</Link><Link aria-current="page" to="/platform/portfolio">Portfolio</Link><Link to="/platform/profile">Account</Link>
      </nav>
    </main>
  );
}
