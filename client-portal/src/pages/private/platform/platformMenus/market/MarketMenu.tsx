import "./marketMenu.scss";
import { useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setChartSymbol } from "@store/slices/socketStockCrypto";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";

type MarketAsset = { id: number; name: string; symbol: string };
type AssetResponse = MarketAsset[] | { results: MarketAsset[] };

const MarketMenu = () => {
  const [cookies] = useCookies(["access_token"]);
  const dispatch = useAppDispatch();
  const selectedSymbol = useAppSelector((state) => state.socketStockCrypto.chartSymbol) || "BTC";
  const [search, setSearch] = useState("");
  const assets = useQuery({
    queryKey: ["market-menu-assets"],
    queryFn: async (): Promise<MarketAsset[]> => {
      const response = await authenticatedRequest<AssetResponse>(apiEndpoints.trades.assets, cookies.access_token);
      return Array.isArray(response) ? response : response.results;
    },
    enabled: Boolean(cookies.access_token),
    staleTime: 5 * 60_000,
  });
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (assets.data ?? []).filter((asset: MarketAsset) =>
      !term || asset.name.toLowerCase().includes(term) || asset.symbol.toLowerCase().includes(term),
    );
  }, [assets.data, search]);

  return (
    <section className="market-menu live-market-menu" aria-labelledby="live-markets-heading">
      <h2 id="live-markets-heading">Live markets</h2>
      <p className="market-menu-description">Choose an available asset to update the chart and trade form.</p>
      <label className="market-menu-search">
        <span className="sr-only">Search markets</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search markets" />
      </label>
      <p className="market-menu-selected">Selected: <strong>{selectedSymbol}</strong></p>
      {assets.isPending && <p role="status">Loading markets…</p>}
      {assets.isError && <p role="alert">{BeyvraErrorMapper.text(assets.error, "market")}</p>}
      {!assets.isPending && !assets.isError && filtered.length === 0 && <p>No markets match your search.</p>}
      <div className="live-market-list" aria-live="polite">
        {filtered.map((asset: MarketAsset) => (
          <button
            type="button"
            key={asset.id}
            className={asset.symbol === selectedSymbol ? "active" : ""}
            onClick={() => dispatch(setChartSymbol(asset.symbol))}
          >
            <span>{asset.name}</span>
            <span>{asset.symbol}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MarketMenu;
