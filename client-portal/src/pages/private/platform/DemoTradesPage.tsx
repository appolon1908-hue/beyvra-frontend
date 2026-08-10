import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { beyvraDemoApi } from "api/generated/beyvra";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

type DemoTrade = { id: number; state: string; result?: string | null; symbol: string; direction: string; amount: string; openingPrice: string; closingPrice?: string | null; openedAt: string; expiresAt: string };

export default function DemoTradesPage() {
  const [cookies] = useCookies(["access_token"]);
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [trades, setTrades] = useState<DemoTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    if (!cookies.access_token) return;
    setLoading(true); setError("");
    try { setTrades(await beyvraDemoApi.trades<DemoTrade[]>(cookies.access_token)); }
    catch (error) { logInternalError(error, { endpoint: "trading.demo_trades" }); setError(toUserSafeErrorText(error, "trading")); }
    finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [cookies.access_token]);
  const visible = trades.filter((trade) => tab === "open" ? trade.state === "OPEN" : trade.state !== "OPEN");
  return <main className="demo-trades-page" aria-labelledby="demo-trades-title"><h1 id="demo-trades-title">Demo Trades</h1><p>All results use virtual funds and have no monetary value.</p><div role="tablist"><button role="tab" aria-selected={tab === "open"} onClick={() => setTab("open")}>Open Trades</button><button role="tab" aria-selected={tab === "closed"} onClick={() => setTab("closed")}>Closed Trades</button></div>{loading ? <p role="status">Loading trades…</p> : error ? <div role="alert">{error} <button onClick={() => void load()}>Retry</button></div> : visible.length === 0 ? <p>No {tab} demo trades.</p> : <div className="demo-trades-list">{visible.map((trade) => <article key={trade.id}><h2>{trade.symbol} · {trade.direction.toUpperCase()}</h2><p>Trade #{trade.id} · Virtual amount ${trade.amount}</p><p>Opening quote: {trade.openingPrice}{trade.closingPrice ? ` · Closing quote: ${trade.closingPrice}` : ""}</p><p>{trade.state}{trade.result ? ` · ${trade.result}` : ""} · Expires {new Date(trade.expiresAt).toLocaleString()}</p></article>)}</div>}</main>;
}
