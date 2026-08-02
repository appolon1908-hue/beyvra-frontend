import { useEffect, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { getSocketUrl } from "utils/env";

const AssetSection = () => {
  interface CryptoAsset {
    symbol: string;
    volume: number;
    change_percentage: number;
    circulating_supply: number;
    price: number;
    wk_52_change_percentage: number;
  }
  // Local state for crypto data
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>([]);
  // Redux state for stock data
  const { stockData } = useAppSelector((state) => state.socketStockCrypto);
  const { wsTicket } = useAppSelector((state) => state.user);

  useEffect(() => {
    let webSocket: WebSocket | null = null;

    try {
      // Establish WebSocket connection
      if (!wsTicket) return;
      webSocket = new WebSocket(getSocketUrl("ws/market-data/", {
        ws_ticket: wsTicket,
        symbol: "BTCUSDT",
        interval: "1m",
      }));
      webSocket.onopen = () => {
        console.log("WebSocket connection established.");

        // The server subscribes using the validated URL parameters.
      };

      webSocket.onmessage = (event) => {
        try {
          const incomingData = JSON.parse(event.data);
          console.log("Data received from WebSocket:", incomingData);

          if (incomingData.type === "candle") {
            setCryptoData([{
              symbol: incomingData.symbol,
              volume: Number(incomingData.volume),
              change_percentage: 0,
              circulating_supply: 0,
              price: Number(incomingData.close),
              wk_52_change_percentage: 0,
            }]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      webSocket.onclose = () => {
        console.log("WebSocket connection closed.");
      };
    } catch (error) {
      console.error("WebSocket error during connection:", error);
    }

    // Clean up WebSocket connection when component is unmounted
    return () => {
      if (webSocket) {
        webSocket.close();
        console.log("WebSocket connection cleaned up.");
      }
    };
  }, [wsTicket]);

  return (
    <div className="portfolioTable mt-3">
      <div className="grid grid-cols-6 mt-3 overview-table-header">
        <span>Asset name</span>
        <span>Current balance</span>
        <span>Profit/ Loss</span>
        <span>Number of shares</span>
        <span>Initial price</span>
        <span>Current price</span>
      </div>

      {/* Render Crypto Data from local state */}
      <p className="text-white/90 text-sm my-3 capitalize">crypto</p>
      {cryptoData.length > 0 ? (
        cryptoData.slice(0, 10).map((asset, index) => (
          <div
            key={index}
            className="asset-grid w-full grid grid-cols-6 body-tab"
          >
            {/* Asset name */}
            {/* <span>{asset.symbol.replace(/USD(?!.*USD)/, "")}</span> */}
            
            <span>{asset.symbol.replace(/[\w\-]*USD\s*/g, "")}</span>

            {/* <span>{asset.symbol}</span> */}
            <span>{asset.symbol}</span>

            {/* Current balance */}
            <span>{asset.volume}</span>

            {/* Profit / Loss */}
            <span>{asset.change_percentage}%</span>

            {/* Number of shares (if available, otherwise use circulating_supply as approximation) */}
            <span>{asset.circulating_supply}</span>

            {/* Initial price (might need a custom calculation) */}
            <span>
              $
              {(
                asset.price /
                (1 + asset.wk_52_change_percentage / 100)
              ).toFixed(2)}
            </span>

            {/* Current price */}
            <span>${asset.price}</span>
          </div>
        ))
      ) : (
        <p>No crypto data available.</p>
      )}

      {/* Render Stock Data from Redux */}
      <p className="text-white/90 text-sm my-3 capitalize">stocks</p>
      {stockData && stockData.length > 0 ? (
        stockData.slice(0, 10).map((asset, index) => (
          <div
            key={index}
            className="asset-grid w-full grid grid-cols-6 body-tab"
          >
            <span>{asset.T}</span>
            <span>{asset.v}</span>
            <span>${asset.vw}</span>
            <span>{asset.n}</span>
            <span>${asset.o}</span>
            <span>${asset.c}</span>
          </div>
        ))
      ) : (
        <p>No stock data available.</p>
      )}
    </div>
  );
};

export default AssetSection;
