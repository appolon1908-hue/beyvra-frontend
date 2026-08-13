import type { PortfolioHolding } from "api/portfolio/usePortfolioSummary";

const money = (value: number) => value.toLocaleString(undefined, { style: "currency", currency: "USD" });

const AssetSection = ({ holdings }: { holdings: PortfolioHolding[] }) => (
  <div className="portfolioTable mt-3">
    <div className="grid grid-cols-6 mt-3 overview-table-header" role="row">
      <span>Asset name</span>
      <span>Current balance</span>
      <span>Profit/Loss</span>
      <span>Number of shares</span>
      <span>Initial price</span>
      <span>Current price</span>
    </div>
    {holdings.length === 0 ? (
      <p className="text-white/90 text-sm my-3">No portfolio holdings yet.</p>
    ) : holdings.map((asset) => (
      <div key={asset.id} className="asset-grid w-full grid grid-cols-6 body-tab" role="row">
        <span>{asset.name}<small>{asset.asset_type}</small></span>
        <span>{money(asset.current_balance)}</span>
        <span className={asset.profit_loss < 0 ? "loss" : "gain"}>{money(asset.profit_loss)}</span>
        <span>{asset.number_of_shares}</span>
        <span>{money(asset.initial_price)}</span>
        <span>{money(asset.current_price)}</span>
      </div>
    ))}
  </div>
);

export default AssetSection;
