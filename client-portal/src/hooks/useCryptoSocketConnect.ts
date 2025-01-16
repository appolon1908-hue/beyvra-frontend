import { useAppDispatch } from "@store/hooks";
import {
  setCryptoData,
  setCurrentBalance,
  setProfitLoss,
  setStockData,
} from "@store/slices/socketStockCrypto";
import { setWalletTypes } from "@store/slices/wallet";
import useWalletTypes from "api/wallet/useWalletTypes";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import getEnv from "utils/env";

const useCryptoSocketConnect = (wsTicket: string, id: string) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const [cryptoSocket, setCryptoSocket] = useState<WebSocket | null>(null);
  const [stockSocket, setStockSocket] = useState<WebSocket | null>(null);
  const [balanceSocket, setBalanceSocket] = useState<WebSocket | null>(null);
  const [profitLossSocket, setProfitLossSocket] = useState<WebSocket | null>(
    null
  );
  const { mutate: getCurrency } = useWalletTypes({
    onSuccess: (data) => {
      dispatch(setWalletTypes(data.results));
    },
    onError: (error) => {
      // console.log("fetching wallet-types error", error);
    },
  });

  useEffect(() => {
    getCurrency(cookies.access_token);
  }, [cookies.access_token]);

  useEffect(() => {
    if (wsTicket) {
      const webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/current-balance/${id}/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onopen = () => {
        return setBalanceSocket(webSocket);
      };

      webSocket.onmessage = (event) => {
        if (event && event.data) {
          const localData = JSON.parse(event.data);
          dispatch(setCurrentBalance(localData?.current_balance || 0));
        }
      };
    }
    return () => {
      if (balanceSocket) {
        balanceSocket.close();
      }
    };
  }, [wsTicket, id]);

  useEffect(() => {
    if (wsTicket) {
      const webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/profit-loss/${id}/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onopen = () => {
        return setProfitLossSocket(webSocket);
      };

      webSocket.onmessage = (event) => {
        if (event && event.data) {
          const localData = JSON.parse(event.data);
          dispatch(setProfitLoss(localData?.profit_loss || 0));
        }
      };
    }
    return () => {
      if (profitLossSocket) {
        profitLossSocket.close();
      }
    };
  }, [wsTicket, id]);

  useEffect(() => {
    if (wsTicket) {
      const webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/crypto-market-data/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onopen = () => {
        return setCryptoSocket(webSocket);
      };

      webSocket.onmessage = (event) => {
        if (event && event.data) {
          try {
            const localData = JSON.parse(event.data);
            localData?.results && dispatch(setCryptoData(localData?.results));
          } catch (error) {}
        }
      };
    }
    return () => {
      if (cryptoSocket) {
        cryptoSocket.close();
      }
    };
  }, [wsTicket]);

  useEffect(() => {
    if (wsTicket) {
      const webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/stock-market-data/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onopen = () => {
        return setStockSocket(webSocket);
      };

      webSocket.onmessage = (event) => {
        if (event && event.data) {
          try {
            const localData = JSON.parse(event.data);
            localData?.results && dispatch(setStockData(localData?.results));
          } catch (error) {}
        }
      };
    }
    return () => {
      if (stockSocket) {
        stockSocket.close();
      }
    };
  }, [wsTicket]);
};

export default useCryptoSocketConnect;
