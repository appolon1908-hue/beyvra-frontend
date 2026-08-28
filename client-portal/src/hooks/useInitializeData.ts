import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { ApiError } from "api/errors";
import { beyvraAuthApi } from "api/generated/beyvra";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { UserSliceState, setUser, setUserLoading, setWSTicket } from "@store/slices/user";
import {
  WalletSliceState,
  setSelectedWallet,
  setWallets,
  setWalletsLoading,
} from "@store/slices/wallet";

import useProfile from "api/user/useProfile";
import useWallet from "api/wallet/useWallet";
import useWebSocketTicket from "api/user/useWebSocketTicket";
import { NotificationSliceState, setNotificationList, setNotificationLoading } from "@store/slices/notification";
import useNotificationList from "api/notification/useNotificationList";

/**
 * Custom hook to initialize user and wallet data upon login.
 * Fetches data from corresponding APIs and updates the Redux store.
 * Ensures data is fetched only if not already available.
 *
 * @returns {Object} An object containing user and wallet data.
 */
const useInitializeData = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token","selectedAccount"]);
  const initializedNotificationsFor = useRef<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const authToken = cookies.access_token ?? "";

  // Fetch user data
  const { user } = useAppSelector(
    (state: { user: UserSliceState }) => state.user
  );

  const { mutate: profileMutate } = useProfile({
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
    onError: () => {
      console.log('error');
    },
  });

  // Fetch wallet data
  const { wallets } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );
  const { mutate: walletMutate } = useWallet({
    onSuccess: (data) => {
      dispatch(setWallets(data.results));
      const selectedAccountId = cookies.selectedAccount?.id; // Extract the ID from the cookies
      console.log(selectedAccountId);
      console.log(data.results);
      // Find the wallet in the wallets array that matches the selectedAccountId
      const selectedWalletFromCookies = data.results.find(wallet => wallet.id === selectedAccountId);

      dispatch(
        setSelectedWallet(
          selectedWalletFromCookies ?? data.results[0] ?? undefined
        )
      );
    },
    onError: (error) => {
      console.error("fetching wallets error", error);
    },
  });

  // Fetch notification data
  const { notificationList } = useAppSelector(
    (state: { notification: NotificationSliceState }) => state.notification
  );
  const { mutate: notificationListMutate } = useNotificationList({
    onSuccess: (data) => {
      dispatch(setNotificationList(data.notifications ?? []));
      dispatch(setNotificationLoading(false));
    },
    onError: (error) => {
      dispatch(setNotificationLoading(false));
      console.error("fetching notification list error", error);
    },
  });
  
  useEffect(() => {
    let disposed = false;
    beyvraAuthApi.session<{ state?: string }>()
      .then(() => {
        if (!disposed) setSessionReady(true);
      })
      .catch((error: unknown) => {
        if (!disposed && error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setSessionReady(false);
        }
      });
    return () => { disposed = true; };
  }, []);

  // Effect to fetch user data on login initialization
  useEffect(() => {
    if (sessionReady && (!user || Object.keys(user).length === 0)) {
      setUserLoading(true);
      profileMutate(authToken);
    }
  }, [authToken, profileMutate, sessionReady, user]);

  // Effect to fetch wallet data on login initializatio
  useEffect(() => {
    if (sessionReady && (!wallets || wallets.length === 0)) {
      setWalletsLoading(true);
      walletMutate(authToken);
    }
  }, [authToken, sessionReady, walletMutate, wallets]);

  // Effect to fetch wallet data on login initializatio
  useEffect(() => {
    if (
      sessionReady &&
      initializedNotificationsFor.current !== (authToken || "cookie-session")
    ) {
      initializedNotificationsFor.current = authToken || "cookie-session";
      dispatch(setNotificationLoading(true));
      notificationListMutate(authToken);
    }
  }, [authToken, dispatch, notificationListMutate, sessionReady]);



  return { user, wallets };
};

export default useInitializeData;
