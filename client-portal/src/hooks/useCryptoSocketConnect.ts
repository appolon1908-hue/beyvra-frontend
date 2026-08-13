import { useAppDispatch } from "@store/hooks";
import { setCurrentBalance, setProfitLoss } from "@store/slices/socketStockCrypto";
import { setWalletTypes } from "@store/slices/wallet";
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
    return realtime.subscribe(`portfolio.${id}`, (message) => {
      const data = (message.data || message.payload || {}) as Record<string, unknown>;
      if (data.current_balance !== undefined) dispatch(setCurrentBalance(Number(data.current_balance) || 0));
      if (data.profit_loss !== undefined) dispatch(setProfitLoss(Number(data.profit_loss) || 0));
    });
  }, [wsTicket, id, dispatch]);
};

export default useCryptoSocketConnect;
