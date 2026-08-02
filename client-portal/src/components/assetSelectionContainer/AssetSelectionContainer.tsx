import {
  PlusIcon2,
  SearchIcon2,
  InfoCircleIconSmall,
  ArrowDownOS,
  FilterBarsIcon,
} from "../../assets/icons";
import "./assetSelectionContainer.scss";
import { useEffect, useState } from "react";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  setChartSymbol,
} from "@store/slices/socketStockCrypto";
import type { CryptoChartDataType } from "hooks/useSocketConnect";
import { getSocketUrl } from "utils/env";

function calculatePercentageChange(
  currentPrice: number,
  percentageChange: number
): number {
  const value = currentPrice / (1 + percentageChange / 100);
  return Number.isNaN(value) ? 0 : value;
}

const SortFilter = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-assets-dropdown-container">
      <DropdownMenu
        position="bottom dropdown-position-fixed"
        type="drop-down"
        menuItems={[
          {
            text: "Profitability",
            onclick: () => {},
            icon: <FilterBarsIcon height="20" width="20" />,
          },
          {
            text: "Popularity",
            onclick: () => {},
            icon: <FilterBarsIcon height="20" width="20" />,
          },
          {
            text: "Name A–Z",
            onclick: () => {},
            icon: <FilterBarsIcon height="20" width="20" />,
          },
          {
            text: "Name Z–A",
            onclick: () => {},
            icon: <FilterBarsIcon height="20" width="20" />,
          },
        ]}
        callback={setOpen}
      >
        <div className="filter-assets-item-container">
          <FilterBarsIcon height="20" width="20" />
          <h5 className="filter-assets-item-text">Profitability</h5>
          <div className={open ? "arrow-svg" : ""}>
            <ArrowDownOS height="12" width="12" />
          </div>
        </div>
      </DropdownMenu>
    </div>
  );
};

let isAdded = false;

const AssetSelectionContainer: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isSelected, setSelected] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [headerData, setHeaderData] = useState<{
    [key: number]: CryptoChartDataType;
  }>({});
  const [data, setData] = useState<{ [key: number]: CryptoChartDataType }>({});
  const [cryptoSocket, setCryptoSocket] = useState<WebSocket | null>(null);
  const { wsTicket } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (wsTicket) {
      const webSocket = new WebSocket(
        getSocketUrl("ws/market-data/", {
          ws_ticket: wsTicket,
          symbol: "BTCUSDT",
          interval: "1m",
        }),
      );

      webSocket.onerror = () => {
        console.error("WebSocket connection error");
        throw new Error("WebSocket connection error");
      };

      webSocket.onopen = () => {
        setCryptoSocket(webSocket); // Set WebSocket after it's successfully opened
      };

      webSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type !== "candle") return;
          const data = {
            id: 1,
            p: Number(message.close),
            t: String(message.time),
            symbol: String(message.symbol).replace(/USDT$/, ""),
          } as CryptoChartDataType;
          console.log("WebSocket data received:", data);

          // Update chart data
          setData((prev) => ({
            ...prev,
            [data.id]: data,
          }));

          // Add header data if it's not already added
          if (!isAdded) {
            isAdded = true;
            setHeaderData((prev) => ({
              ...prev,
              [data.id]: data,
            }));

            // Dispatch action to set chart symbol
            dispatch(setChartSymbol(data.symbol));
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      return () => {
        // Clean up: close WebSocket connection
        webSocket.close();
      };
    }
  }, [wsTicket, dispatch]);

  return (
    <div className="trade-assets-main-container">
      <div
        className={isOpen ? "close-svg" : "plus-svg"}
        onClick={() => setOpen(!isOpen)}
      >
        <PlusIcon2 />
      </div>
      <div className="header-assets-list-container">
        {Object.values(headerData).map((item, index) => (
          <div
            key={index}
            className="header-assets-item-container"
            style={{
              background: index === selectedIndex ? "#f2f2f22e" : "#f2f2f214",
            }}
            onClick={() => {
              setSelectedIndex(index);
              dispatch(setChartSymbol(item.symbol));
            }}
          >
            <img
              src="cryptoIcon.svg"
              alt={item.symbol}
              style={{ width: 28, height: 28 }}
            />
            <div className="header-assets-text-container">
              <h5 className="header-asset-text-title">{item.symbol}</h5>
              <h5 className="header-asset-text-per">{`${calculatePercentageChange(
                item?.p,
                item?.p24h
              ).toFixed(2)}%`}</h5>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="trade-assets-dropdown-container">
          <div className="container">
            <div
              className="section"
              onClick={() => {
                //setData([]);           -----------------      Commented By ER
                setSelected(0);
              }}
            >
              <h3 className={isSelected === 0 ? "seletecColor" : ""}>Crypto</h3>
              <div
                className={`unseletecTabLine ${
                  isSelected === 0 ? "seletecTabLine" : ""
                }`}
              />
            </div>
            <div
              className="section"
              onClick={() => {
                //setData([]);             -----------------      Commented By ER
                setSelected(1);
              }}
            >
              <h3 className={isSelected === 1 ? "seletecColor" : ""}>Stocks</h3>
              <div
                className={`unseletecTabLine ${
                  isSelected === 1 ? "seletecTabLine" : ""
                }`}
              />
            </div>
          </div>
          <div className="search-container">
            <div className="search-box">
              <input
                className="search-input"
                name="asset-search-field"
                placeholder="Search"
                type="text"
              />
              <SearchIcon2 />
            </div>
          </div>
          <div className="asset-list-container">
            <div className="asset-list-subtitle-container">
              <h5 className="asset-list-subtitle">Name</h5>
              <h5 className="asset-list-subtitle">Profitability</h5>
            </div>
          </div>
          <div className="asset-list-scrollable">
            {Object.values(data).map((item, index) => (
              <div
                key={index}
                className="asset-list-item-container"
                onClick={() => {
                  setHeaderData((prev) => ({
                    ...prev,
                    [item.id]: item,
                  }));
                  const selectedIdx = Object.values(data).findIndex(
                    (subItem) => subItem.symbol === item.symbol
                  );
                  setSelectedIndex(selectedIdx);
                  dispatch(setChartSymbol(item.symbol));
                }}
              >
                <h5 className="asset-list-item-title">{item?.symbol}</h5>
                <h5 className="asset-list-item-per">
                  {item?.change_percentage}%
                </h5>
                <InfoCircleIconSmall />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetSelectionContainer;
