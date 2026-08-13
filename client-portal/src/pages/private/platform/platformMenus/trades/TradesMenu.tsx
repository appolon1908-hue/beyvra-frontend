import { useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useAppSelector } from "@store/hooks";
import { useTrades, type TradeRecord } from "api/trades/useTrades";
import type { LeftSubDrawer } from "../../types";
import type { Dispatch, SetStateAction } from "react";
import "./tradesMenu.scss";
import { toUserSafeErrorText } from "errors/userSafeError";

interface TradesMenuProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

type TradeStatus = "open" | "pending" | "completed";

const TradesMenu = (_props: TradesMenuProps) => {
  const [status, setStatus] = useState<TradeStatus>("open");
  const [search, setSearch] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const { themeSelect } = useAppSelector((state) => state.themeBg);
  const trades = useTrades(cookies.access_token, status);
  const filtered = useMemo(() => (trades.data || []).filter((trade: TradeRecord) =>
    `${trade.id} ${trade.instrument} ${trade.side}`.toLowerCase().includes(search.toLowerCase()),
  ), [search, trades.data]);

  return (
    <section className={`${themeSelect} tradesMenu`} aria-labelledby="trades-heading">
      <h2 id="trades-heading">Trades</h2>
      <div className="slider" role="tablist" aria-label="Trade status">
        {(["open", "pending", "completed"] as TradeStatus[]).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={status === item}
            className={status === item ? "active" : ""} onClick={() => setStatus(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      <label>
        <span className="sr-only">Search trades</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search trades" />
      </label>
      {trades.isPending && <p role="status">Loading trades…</p>}
      {trades.isError && <div role="alert"><p>{toUserSafeErrorText(trades.error, "trading")}</p><button type="button" onClick={() => trades.refetch()}>Try again</button></div>}
      {!trades.isPending && !trades.isError && filtered.length === 0 && <p>No {status} trades.</p>}
      <div className="trade-lifecycle-list">
        {filtered.map((trade: TradeRecord) => (
          <article key={trade.id} className="assetsListItem">
            <div><strong>Trade #{trade.id}</strong><p>{trade.side} {trade.instrument} · ${Number(trade.price).toFixed(2)}</p></div>
            <div><p>{trade.state}</p><p>Fee: ${Number(trade.fee).toFixed(2)}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TradesMenu;
