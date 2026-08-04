import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setChartSymbol } from "@store/slices/socketStockCrypto";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { PlusIcon2, SearchIcon2 } from "../../assets/icons";
import "./assetSelectionContainer.scss";

type MarketAsset = {
  id: number;
  name: string;
  symbol: string;
  image?: string | null;
};

type AssetResponse = MarketAsset[] | {
  results: MarketAsset[];
};

const AssetSelectionContainer: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [search, setSearch] = useState("");
  const chartSymbol = useAppSelector((state) => state.socketStockCrypto.chartSymbol) || "BTC";
  const assets = useQuery({
    queryKey: ["trade-assets"],
    queryFn: async (): Promise<MarketAsset[]> => {
      const response = await authenticatedRequest<AssetResponse>(
        apiEndpoints.trades.assets,
        cookies.access_token,
      );
      return Array.isArray(response) ? response : response.results;
    },
    enabled: Boolean(cookies.access_token),
    staleTime: 5 * 60_000,
  });
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (assets.data ?? []).filter((asset: MarketAsset) =>
      !term || asset.name.toLowerCase().includes(term) || asset.symbol.toLowerCase().includes(term)
    );
  }, [assets.data, search]);

  const selectAsset = (asset: MarketAsset) => {
    dispatch(setChartSymbol(asset.symbol));
    setOpen(false);
  };

  useEffect(() => {
    const closeForTrade = () => {
      setOpen(false);
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    };
    window.addEventListener("platform-trade-open", closeForTrade);
    return () => window.removeEventListener("platform-trade-open", closeForTrade);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="trade-assets-main-container">
      <button
        type="button"
        ref={triggerRef}
        className={isOpen ? "close-svg" : "plus-svg"}
        aria-label={isOpen ? "Close asset selector" : "Add or change asset"}
        aria-expanded={isOpen}
        onClick={() => {
          const next = !isOpen;
          if (next) window.dispatchEvent(new Event("platform-market-open"));
          setOpen(next);
        }}
      >
        <PlusIcon2 />
      </button>
      <div className="header-assets-list-container">
        <button type="button" className="header-assets-item-container" aria-label={`Selected asset ${chartSymbol}`}>
          <img src="cryptoIcon.svg" alt="" style={{ width: 28, height: 28 }} />
          <div className="header-assets-text-container">
            <h5 className="header-asset-text-title">{chartSymbol}</h5>
          </div>
        </button>
      </div>

      {isOpen && (
        <>
          <button type="button" className="asset-drawer-backdrop" aria-label="Close market drawer" onClick={() => { setOpen(false); window.setTimeout(() => triggerRef.current?.focus(), 0); }} />
          <div className="trade-assets-dropdown-container" role="dialog" aria-label="Choose trading asset">
          <label className="search-container">
            <span className="sr-only">Search assets</span>
            <span className="search-box">
              <input
                className="search-input"
                name="asset-search-field"
                placeholder="Search assets"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <SearchIcon2 />
            </span>
          </label>
          <div className="asset-list-scrollable" aria-live="polite">
            {assets.isPending && <p role="status">Loading assets…</p>}
            {assets.isError && <p role="alert">Assets could not be loaded.</p>}
            {!assets.isPending && !assets.isError && filtered.length === 0 && <p>No assets match your search.</p>}
            {filtered.map((asset: MarketAsset) => (
              <button
                type="button"
                key={asset.id}
                className="asset-list-item-container"
                onClick={() => selectAsset(asset)}
              >
                <span className="asset-list-item-title">{asset.name}</span>
                <span className="asset-list-item-per">{asset.symbol}</span>
              </button>
            ))}
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetSelectionContainer;
