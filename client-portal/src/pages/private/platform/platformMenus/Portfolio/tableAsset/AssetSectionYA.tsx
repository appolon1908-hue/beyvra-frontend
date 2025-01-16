import { useEffect, useState } from "react";

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
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws`);
      setWebSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection established.");
        setConnectionStatus("Connected");

        // Initial request for general data type
        const request = { type: "general" };
        ws.send(JSON.stringify(request));
      };

      ws.onmessage = (event) => {
        try {
          const incomingData = JSON.parse(event.data);

          if (incomingData.type === "general" && Array.isArray(incomingData.data)) {
            // Update state with the incoming general data
            setCryptoData(incomingData.data);
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
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    // Clean up WebSocket connection on component unmount
    return () => {
      if (webSocket) {
        webSocket.close();
        console.log("WebSocket connection cleaned up.");
      }
    };
  }, [webSocket]);
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
