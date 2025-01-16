import { useEffect } from "react";
import { useCookies } from "react-cookie";

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
      // @ts-ignore
      dispatch(setNotificationList(data.notifications));
    },
    onError: (error) => {
      console.error("fetching notification list error", error);
    },
  });
  

  // Effect to fetch user data on login initialization
  useEffect(() => {
    if (cookies.access_token && (!user || Object.keys(user).length === 0)) {
      setUserLoading(true);
      profileMutate(cookies.access_token);
    }
  }, [cookies.access_token, profileMutate, user]);

  // Effect to fetch wallet data on login initializatio
  useEffect(() => {
    if (cookies.access_token && (!wallets || wallets.length === 0)) {
      setWalletsLoading(true);
      walletMutate(cookies.access_token);
    }
  }, [cookies.access_token, walletMutate]);

  // Effect to fetch wallet data on login initializatio
  useEffect(() => {
    if (cookies.access_token && (!notificationList || notificationList.length === 0)) {
      setNotificationLoading(true);
      notificationListMutate(cookies.access_token);
    }
  }, [cookies.access_token, notificationListMutate]);



  return { user, wallets };
};

export default useInitializeData;
