import { useAppDispatch } from "@store/hooks";
import {
  setCryptoData,
  setCurrentBalance,
  setProfitLoss,
  setStockData,
} from "@store/slices/socketStockCrypto";
import { setWalletTypes } from "@store/slices/wallet";
import type { CryptoStockDataType } from "@store/slices/socketStockCrypto";
import useWalletTypes from "api/wallet/useWalletTypes";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUnifiedRealtimeClient } from "realtime/UnifiedRealtimeClient";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";

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
    if (!wsTicket) return;
    const realtime = getUnifiedRealtimeClient(wsTicket, async () => (await webSocketTicketFetcher(wsTicket)).ws_ticket);
    return realtime.subscribe(`portfolio.balance:${id}`, (message) => {
      const data = (message.data || message.payload || {}) as Record<string, unknown>;
      if (data.current_balance !== undefined) dispatch(setCurrentBalance(Number(data.current_balance) || 0));
    });
  }, [wsTicket, id, dispatch]);

  useEffect(() => {
    if (!wsTicket) return;
    const realtime = getUnifiedRealtimeClient(wsTicket, async () => (await webSocketTicketFetcher(wsTicket)).ws_ticket);
    return realtime.subscribe(`portfolio.profit_loss:${id}`, (message) => {
      const data = (message.data || message.payload || {}) as Record<string, unknown>;
      if (data.profit_loss !== undefined) dispatch(setProfitLoss(Number(data.profit_loss) || 0));
    });
  }, [wsTicket, id, dispatch]);

  useEffect(() => {
    if (!wsTicket) return;
    const realtime = getUnifiedRealtimeClient(wsTicket, async () => (await webSocketTicketFetcher(wsTicket)).ws_ticket);
    return realtime.subscribe("market.compat.crypto", (message) => {
      const data = (message.data || message.payload) as { results?: unknown[] } | undefined;
      if (data?.results) dispatch(setCryptoData(data.results as CryptoStockDataType[]));
    });
  }, [dispatch, wsTicket]);

  useEffect(() => {
    if (!wsTicket) return;
    const realtime = getUnifiedRealtimeClient(wsTicket, async () => (await webSocketTicketFetcher(wsTicket)).ws_ticket);
    return realtime.subscribe("market.compat.stocks", (message) => {
      const data = (message.data || message.payload) as { results?: unknown[] } | undefined;
      if (data?.results) dispatch(setStockData(data.results as CryptoStockDataType[]));
    });
  }, [dispatch, wsTicket]);
};

export default useCryptoSocketConnect;
