import { useAppSelector } from "@store/hooks";
import { setOnlinetraders } from "@store/slices/socketStockCrypto";
import { setTradeResult, setTradeTransaction } from "@store/slices/trade";
import {
  setSelectedWallet,
  setWallets,
  WalletSliceState,
} from "@store/slices/wallet";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export type CryptoChartDataType = {
  id: number;
  p: number;
  p24h: number;
  p7d: number;
  p30d: number;
  p3m: number;
  p1y: number;
  pytd: number;
  pall: number;
  as: number;
  mc: number;
  fmc24hpc: number;
  t: string;
  symbol: string;
  change_percentage?: number;
};

export type ChartDataType = {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
  time: number;
  value: number;
};

interface OnlineTradersData {
  count?: number;
  // Add other relevant fields
}

interface SocketConnectReturn {
  oldData: ChartDataType[];
  data: ChartDataType | null;
}
let isFirstTime = true;

let timestampStart = null;
let openPrice: number = 0;
let highPrice: number = 0;
let lowPrice: number = 0;
let closePrice: number = 0;

const useSocketConnect = (wsTicket: string): SocketConnectReturn => {
  const [oldData, setOldData] = useState<ChartDataType[]>([]);
  const [data, setData] = useState<ChartDataType | null>(null);
  const chartSocket = useRef<WebSocket | undefined>(undefined);

  const dispatch = useDispatch();
  const { wallets } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );
  const { chartSymbol } = useAppSelector((state) => state.socketStockCrypto);

  useEffect(() => {
    let webSocket: WebSocket | undefined;
    if (wsTicket) {
      webSocket = new WebSocket(
        `wss://tradx.io/ws/external-api/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onopen = () => {
        webSocket?.send(
          JSON.stringify({
            group_name: "BTC",
            type: "join_group",
          })
        );
        webSocket?.send(
          JSON.stringify({
            type: "join_group",
            group_name: "o_c",
          })
        );
      };

      webSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        if (receivedData.m === "o_c") {
          const onlineTradersData: OnlineTradersData = {
            count: receivedData.d,
          };
          onlineTradersData?.count &&
            dispatch(setOnlinetraders(onlineTradersData.count));
        } else if (receivedData.m === "wt") {
          console.log(receivedData);
          const updatedWallets = wallets.map((item) => {
            if (item.id == receivedData.d[0].id) {
              return { ...item, balance: receivedData.d[0].balance };
            }
            return item;
          });
          dispatch(setWallets(updatedWallets));
          dispatch(setSelectedWallet(receivedData.d[0]));
        } else if (receivedData.m === "td") {
          if (receivedData.a === "u") {
            console.log("update trading data ", receivedData);
            dispatch(setTradeResult(receivedData.d));
          } else if (receivedData.a === "c") {
            console.log("create trading data", receivedData);
            dispatch(setTradeTransaction(receivedData.d[0]));
          }
        }
      };
    }

    return () => {
      webSocket?.close();
    };
  }, [dispatch, wallets, wsTicket]);

  useEffect(() => {
    let webSocket: WebSocket;

    let chartSymbol = "BTC";
    if (wsTicket && chartSymbol) {
      if (chartSocket.current) {
        setOldData([]);
        setData(null);
        chartSocket.current?.close();
        isFirstTime = true;
      }
      webSocket = new WebSocket(
        `wss://1cryptoscr.tradx.io/ws/ticker/?session_id=${
           wsTicket + "" + Math.random()
         }&symbol=${chartSymbol}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onopen = () => {
        return (chartSocket.current = webSocket);
      };

      webSocket.onmessage = (event) => {

        const receivedData = JSON.parse(event.data) as CryptoChartDataType;

        if (isFirstTime) {
          isFirstTime = false;
          timestampStart = Number(receivedData.t);
          openPrice = receivedData.p;
          highPrice = receivedData.p;
          lowPrice = receivedData.p;
          closePrice = receivedData.p;
          setOldData([
            {
              open: receivedData.p,
              high: receivedData.p,
              low: receivedData.p,
              close: receivedData.p,
              timestamp: Number(receivedData.t),
              time: Number(receivedData.t),
              value: receivedData.p,
            },
          ]);
        } else {
          highPrice = Math.max(highPrice, receivedData.p);
          lowPrice = Math.min(lowPrice, receivedData.p);
          closePrice = receivedData.p;
          setData({
            open: openPrice,
            high: highPrice,
            low: lowPrice,
            close: closePrice,
            timestamp: Number(receivedData.t),
            time: Number(receivedData.t),
            value: receivedData.p,
          });
        }
        // setData((prev) => [...prev, receivedData]);
      };
    }

    return () => {
      if (chartSocket.current) {
        chartSocket.current?.close();
      }
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [wsTicket, chartSymbol]);

  return { data, oldData };
};

export default useSocketConnect;
