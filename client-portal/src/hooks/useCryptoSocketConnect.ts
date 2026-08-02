import { useAppDispatch } from "@store/hooks";
import {
  setCryptoData,
  setCurrentBalance,
  setProfitLoss,
  setStockData,
} from "@store/slices/socketStockCrypto";
import { setWalletTypes } from "@store/slices/wallet";
import useWalletTypes from "api/wallet/useWalletTypes";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import getEnv from "utils/env";

const useCryptoSocketConnect = (wsTicket: string, id: string) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
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
  }, [cookies.access_token, getCurrency]);

  useEffect(() => {
    let webSocket: WebSocket | undefined;
    if (wsTicket) {
      webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/current-balance/${id}/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onmessage = (event) => {
        if (event && event.data) {
          const localData = JSON.parse(event.data);
          dispatch(setCurrentBalance(localData?.current_balance || 0));
        }
      };
    }
    return () => {
      webSocket?.close();
    };
  }, [wsTicket, id, dispatch]);

  useEffect(() => {
    let webSocket: WebSocket | undefined;
    if (wsTicket) {
      webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/profit-loss/${id}/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
      };

      webSocket.onmessage = (event) => {
        if (event && event.data) {
          const localData = JSON.parse(event.data);
          dispatch(setProfitLoss(localData?.profit_loss || 0));
        }
      };
    }
    return () => {
      webSocket?.close();
    };
  }, [wsTicket, id, dispatch]);

  useEffect(() => {
    let webSocket: WebSocket | undefined;
    if (wsTicket) {
      webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/crypto-market-data/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
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
      webSocket?.close();
    };
  }, [dispatch, wsTicket]);

  useEffect(() => {
    let webSocket: WebSocket | undefined;
    if (wsTicket) {
      webSocket = new WebSocket(
        `${getEnv(
          "VITE_SOCKET_BASE_URL"
        )}ws/stock-market-data/?ws_ticket=${wsTicket}`
      );

      webSocket.onerror = function (event) {
        throw Error("Websocket connection error");
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
      webSocket?.close();
    };
  }, [dispatch, wsTicket]);
};

export default useCryptoSocketConnect;
