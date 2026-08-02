import { useEffect, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { getSocketUrl } from "utils/env";

interface CryptoAsset {
  id: string;
  symbol: string;
  price: string;
  change: string;
  change_percentage: string;
  market_cap: string;
  volume: string;
  volume_in_currencies_24h: string;
  total_volume_all_currencies_24h: string;
  circulating_supply: string;
  im: string;
}

const AssetSection = () => {
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");
  const { wsTicket } = useAppSelector((state) => state.user);

  useEffect(() => {
    let ws: WebSocket | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const connectWebSocket = () => {
      if (!wsTicket || disposed || ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) return;
      ws = new WebSocket(getSocketUrl("ws/market-data/", {
        ws_ticket: wsTicket,
        symbol: "BTCUSDT",
        interval: "1m",
      }));

      ws.onopen = () => {
        console.log("WebSocket connection established.");
        setConnectionStatus("Connected");

      };

      ws.onmessage = (event) => {
        try {
          const incomingData = JSON.parse(event.data);

          if (incomingData.type === "candle") {
            setCryptoData([{
              id: incomingData.symbol,
              symbol: incomingData.symbol,
              price: String(incomingData.close),
              change: "0",
              change_percentage: "0",
              market_cap: "0",
              volume: String(incomingData.volume),
              volume_in_currencies_24h: "0",
              total_volume_all_currencies_24h: "0",
              circulating_supply: "0",
              im: incomingData.symbol,
            }]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("Error connecting");
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed.", event);
        setConnectionStatus("Connection closed. Reconnecting...");

        // Attempt to reconnect after a delay
        if (!disposed) retryTimer = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    // Clean up WebSocket connection on component unmount
    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, [wsTicket]);
  //  // Mapping for crypto images
  //  const cryptoImages: Record<string, string> = {
  //   Bitcoin: Bitcoin, // Bitcoin
  //   Ethereum: Ethereum, // Ethereum
  //   TetherUSDt: TetherUSDt, // Tether USD
  //   BNB: BNB, // BNB
  //   Solana: Solana, // Solana
  //   USDCoin: USDCoin,
  //   XRP: XRP,
  //   LidoStakedETH: LidoStakedETH,
  //   Dogecoin: Dogecoin,
  //   WrappedTRON: WrappedTRON,
  //   TRON: TRON,
  //   Toncoin: Toncoin
  // };
  return (
    <div className="portfolioTable mt-3">
      <div className="grid grid-cols-8 mt-3 overview-table-header">
        {/* <span></span> */}
        <span>Asset Name</span>
        <span>Price</span>
        <span>Change</span>
        <span>% Change</span>
        <span>Market Cap</span>
        <span>Volume</span>
        <span>Circulating Supply</span>

      </div>

      {cryptoData.length > 0 ? (
        cryptoData.map((asset) => (

          <div key={asset.id} className="asset-grid w-full grid grid-cols-8 body-tab">
            
            {/* <span>
              <img
                src={cryptoImages[asset.im || asset.symbol] } // Default to Bitcoin if symbol not found
                alt={asset.symbol}
                style={{ width: 28, height: 28 }}
              />
            </span> */}
            <span style={{ margin: 0 }}>{asset.symbol}</span>
            <span>{asset.price}</span>
            <span style={{
                color: parseFloat(asset.change) < 0 ? 'red' : 'green', // Red for negative, green for positive
              }}
            >
              {asset.change}
            </span>
            <span style={{
                color: parseFloat(asset.change_percentage) < 0 ? 'red' : 'green', // Red for negative, green for positive
              }}
            >
              {asset.change_percentage}
            </span>
            <span>{asset.market_cap.toLocaleString()}</span>
            <span>{asset.volume.toLocaleString()}</span>
            
            <span>{asset.circulating_supply.toLocaleString()}</span>
          </div>
        ))
      ) : (
        <p>No crypto data available.</p>
      )}
      
    </div>

  );
};

export default AssetSection;
