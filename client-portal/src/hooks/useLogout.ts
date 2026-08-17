import { useCallback, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { revokeSession } from "api/user/logout";
import { writeCompatibilityValue } from "compat/storageKeys";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";
import { setWallets } from "@store/slices/wallet";

/**
 * Performs one consistent logout transaction everywhere in the application.
 * Local credentials are always cleared, even when server revocation is
 * unavailable, and the storage event signs the user out in other tabs.
 */
export default function useLogout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, , removeCookie] = useCookies(["access_token", "refresh_token"]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutInFlight = useRef(false);

  const logout = useCallback(async (destination = "/signIn?tab=login") => {
    if (logoutInFlight.current) return;
    logoutInFlight.current = true;
    setIsLoggingOut(true);
    try {
      await revokeSession(cookies.access_token, cookies.refresh_token);
    } catch {
      // Revocation is best-effort. Never leave credentials in the browser
      // because the network or an already-expired token is unavailable.
    } finally {
      dispatch(setUser(null));
      dispatch(setWallets([]));
      removeCookie("access_token", { path: "/" });
      removeCookie("refresh_token", { path: "/" });
      writeCompatibilityValue(
        localStorage,
        "beyvra:last-logout",
        Date.now().toString(),
        "codestra:last-logout",
      );
      navigate(destination, { replace: true });
      logoutInFlight.current = false;
      setIsLoggingOut(false);
    }
  }, [cookies.access_token, cookies.refresh_token, dispatch, navigate, removeCookie]);

  return { logout, isLoggingOut };
}
