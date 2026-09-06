import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";
import { setWallets } from "@store/slices/wallet";
import { beyvraAuthApi } from "api/generated/beyvra";
import { ApiError } from "api/errors";
import { revokeSession } from "api/user/logout";
import useKyc from "api/kyc/useKycInfo";
import WarningIcon from "assets/icons/WarningIcon";
import { writeCompatibilityValue } from "compat/storageKeys";
import Modal from "components/modal/Modal";
import { logInternalError } from "errors/userSafeError";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";
import { authCookieOptions } from "security/authCookies";
import { BFF_GUEST_MARKER, BFF_SESSION_MARKER } from "security/bffSession";
import "./styles.scss";

const idleTimeLimit = 15 * 60 * 1000;
const kycTimeLimit = 10 * 60 * 1000;
let timeoutId: NodeJS.Timeout;

type BootstrapState = "BOOTING" | "ANONYMOUS" | "GUEST_READY" | "USER_READY" | "EXPIRED" | "ERROR";

const RequireAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["access_token", "refresh_token"]);
  const [show, setShow] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [bootstrap, setBootstrap] = useState<BootstrapState>("BOOTING");
  const [bootstrapError, setBootstrapError] = useState("");

  useEffect(() => {
    let disposed = false;
    const resolveSession = async () => {
      try {
        return await beyvraAuthApi.session<{ state?: string }>(cookies.access_token);
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) throw error;
        await beyvraAuthApi.refreshSession();
        return beyvraAuthApi.session<{ state?: string }>();
      }
    };

    setBootstrap("BOOTING");
    resolveSession()
      .then((payload) => {
        if (disposed) return;
        const guest = payload.state === "guest.ready";
        const marker = guest ? BFF_GUEST_MARKER : BFF_SESSION_MARKER;
        if (cookies.access_token !== marker) {
          setCookie("access_token", marker, authCookieOptions(false));
          removeCookie("refresh_token", { path: "/" });
        }
        setBootstrap(guest ? "GUEST_READY" : "USER_READY");
      })
      .catch((error: unknown) => {
        if (disposed) return;
        if (error instanceof ApiError && error.status === 401) {
          removeCookie("access_token", { path: "/" });
          removeCookie("refresh_token", { path: "/" });
          setBootstrap("ANONYMOUS");
          return;
        }
        setBootstrap("ERROR");
        setBootstrapError(BeyvraErrorMapper.text(error, "auth"));
        logInternalError(error, { endpoint: "auth.session_bootstrap" });
      });

    return () => { disposed = true; };
  }, [cookies.access_token, removeCookie, setCookie]);

  const isGuestDemo = bootstrap === "GUEST_READY";
  const { mutate: mutateKYC } = useKyc({
    onSuccess: (data) => {
      const tempStatus = data?.results[0]?.status || "F";
      if (tempStatus === "F") setTimeout(() => setShow(true), kycTimeLimit);
    },
    onError: () => {},
  });

  const expireSession = () => {
    removeCookie("access_token", { path: "/" });
    removeCookie("refresh_token", { path: "/" });
    navigate("/session-expired", { replace: true, state: { from: location } });
  };

  const handleKeepLogin = async () => {
    try {
      await beyvraAuthApi.refreshSession();
      setIsIdle(false);
    } catch {
      expireSession();
    }
  };

  const handleLogout = async () => {
    try {
      const logoutUrl = await revokeSession();
      dispatch(setUser(null));
      dispatch(setWallets([]));
      removeCookie("access_token", { path: "/" });
      removeCookie("refresh_token", { path: "/" });
      writeCompatibilityValue(localStorage, "beyvra:last-logout", Date.now().toString(), "codestra:last-logout");
      window.location.assign(logoutUrl);
    } catch (error) {
      logInternalError(error, { endpoint: "auth.logout" });
      navigate("/logout", { replace: true });
    }
  };

  const resetTimer = () => {
    setIsIdle(false);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => setIsIdle(true), idleTimeLimit);
  };

  useEffect(() => {
    if (bootstrap !== "USER_READY" && bootstrap !== "GUEST_READY") return;
    if (!isGuestDemo) mutateKYC({ token: BFF_SESSION_MARKER });
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [bootstrap, isGuestDemo, mutateKYC]);

  useEffect(() => {
    if (bootstrap !== "USER_READY") return;
    const refresh = () => {
      beyvraAuthApi.refreshSession().catch(expireSession);
    };
    const intervalId = window.setInterval(refresh, 10 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, [bootstrap]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "beyvra:last-logout" && event.key !== "codestra:last-logout") return;
      dispatch(setUser(null));
      dispatch(setWallets([]));
      removeCookie("access_token", { path: "/" });
      removeCookie("refresh_token", { path: "/" });
      navigate("/signIn?tab=login", { replace: true });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch, navigate, removeCookie]);

  if (bootstrap === "BOOTING") return <div className="route-bootstrap" role="status" aria-live="polite">Loading your Beyvra session…</div>;
  if (bootstrap === "ERROR") return <main className="route-bootstrap route-bootstrap--error"><h1>Session unavailable</h1><p>{bootstrapError}</p><button type="button" onClick={() => window.location.reload()}>Try Again</button><button type="button" onClick={() => navigate("/login", { replace: true })}>Back to Login</button></main>;
  if (bootstrap === "EXPIRED") return <main className="route-bootstrap route-bootstrap--error"><h1>Session expired</h1><p>Log in to continue.</p><button type="button" onClick={() => navigate("/login", { replace: true, state: { from: location } })}>Log In</button></main>;
  if (bootstrap === "ANONYMOUS") {
    const destination = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(destination)}`} replace state={{ from: location }} />;
  }

  return (
    <>
      <Outlet />
      <Modal rootClassName="idle_warn_modal" open={isIdle} setOpen={() => {}} closeable={false}>
        <div className="confirmEmailContainer">
          <span className="confirmEmailTitle">Session paused</span>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><WarningIcon /></div>
          <span className="confirmEmailSubTitle" style={{ marginTop: 16 }}>Your account is idle</span>
          <button onClick={handleKeepLogin} className="confirmEmailContinueButton">Reactivate</button>
          <button onClick={handleLogout} className="confirmEmailCancelButton">Log out</button>
        </div>
      </Modal>
      <Modal rootClassName="idle_warn_modal" open={show} setOpen={() => {}} onCancel={() => setShow(false)}>
        <div className="confirmEmailContainer">
          <span className="confirmEmailTitle">Verification</span>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <img src="/menu-images//verification.png" style={{ width: 420 }} alt="" />
          </div>
          <span className="confirmEmailNote" style={{ marginTop: 16 }}>Identity verification is not required for this demo session.</span>
          <button onClick={() => setShow(false)} className="confirmEmailCancelButton">Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default RequireAuth;
