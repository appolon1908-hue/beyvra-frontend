import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { logInternalError } from "errors/userSafeError";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";

type Trade = { id: string; state: string; instrument: string; side: string; quantity: string; price: string; fee: string; trade_time: string };

export default function DemoTradesPage() {
  const [cookies] = useCookies(["access_token"]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    if (!cookies.access_token) return;
    setLoading(true); setError("");
    try {
      const payload = await authenticatedRequest<{ results: Trade[] }>(apiEndpoints.simulationTrading.trades, cookies.access_token, { headers: { "X-Beyvra-Simulation-Mode": "true" } });
      setTrades(payload.results);
    } catch (caught) {
      logInternalError(caught, { endpoint: "trading.trades" });
      setError(BeyvraErrorMapper.text(caught, "trading"));
    } finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [cookies.access_token]);
  return <main className="demo-trades-page" aria-labelledby="demo-trades-title"><h1 id="demo-trades-title">Simulated Trades</h1><p>All results use virtual funds and have no monetary value.</p>{loading ? <p role="status">Loading trades…</p> : error ? <div role="alert">{error} <button onClick={() => void load()}>Retry</button></div> : trades.length === 0 ? <p>No simulated trades.</p> : <div className="demo-trades-list">{trades.map((trade) => <article key={trade.id}><h2>{trade.instrument} · {trade.side}</h2><p>Trade #{trade.id} · Quantity {trade.quantity}</p><p>Execution price: {trade.price} · Fee: {trade.fee}</p><p>{trade.state} · {new Date(trade.trade_time).toLocaleString()}</p></article>)}</div>}</main>;
}
