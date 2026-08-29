import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";
import { setWallets } from "@store/slices/wallet";

import Modal from "components/modal/Modal";
import WarningIcon from "assets/icons/WarningIcon";

import "./styles.scss";
import useKyc from "api/kyc/useKycInfo";
import { revokeSession } from "api/user/logout";
import { beyvraAuthApi } from "api/generated/beyvra";
import { logInternalError } from "errors/userSafeError";
import { writeCompatibilityValue } from "compat/storageKeys";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";
import { ApiError } from "api/errors";

type Portal = "client" | "admin" | "contractor";
type SessionPayload = {
  state?: string;
  portal?: Portal;
  allowedPortals?: Portal[];
};

type RequireAuthProps = {
  allowedPortals?: Portal[];
};

const idleTimeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
const kycTimeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds
let timeoutId: NodeJS.Timeout;

const RequireAuth = ({ allowedPortals }: RequireAuthProps) => {
  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, , removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [show, setShow] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [bootstrap, setBootstrap] = useState<"BOOTING" | "ANONYMOUS" | "GUEST_READY" | "USER_READY" | "EXPIRED" | "ERROR">("BOOTING");
  const [bootstrapError, setBootstrapError] = useState("");
  const [sessionPortal, setSessionPortal] = useState<Portal>("client");
  const [sessionAllowedPortals, setSessionAllowedPortals] = useState<Portal[]>(["client"]);
  const isLegacyGuestDemo = Boolean(cookies.access_token && (() => {
    try { return JSON.parse(atob(cookies.access_token.split(".")[1])).guest_demo === true; } catch { return false; }
  })());
  const isGuestDemo = bootstrap === "GUEST_READY" || isLegacyGuestDemo;

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);
    setBootstrap("BOOTING");
    beyvraAuthApi.session<SessionPayload>()
      .then(async (payload) => {
        if (disposed) return;
        const nextPortal = payload.portal ?? "client";
        const nextAllowed = payload.allowedPortals?.length ? payload.allowedPortals : [nextPortal];
        setSessionPortal(nextPortal);
        setSessionAllowedPortals(nextAllowed);
        setBootstrap(payload.state === "guest.ready" ? "GUEST_READY" : "USER_READY");
      })
      .catch((error: unknown) => {
        if (disposed) return;
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setBootstrap("ANONYMOUS");
          return;
        }
        setBootstrap("ERROR");
        setBootstrapError(BeyvraErrorMapper.text(error, "auth"));
        logInternalError(error, { endpoint: "auth.session_bootstrap" });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { disposed = true; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  const { mutate: mutateKYC } = useKyc({
    onSuccess: (data) => {
      const tempStatus = data?.results[0]?.status || 'F';
      tempStatus === 'F' && setTimeout(() => {
        setShow(true);
      }, kycTimeLimit);
    },
    onError: () => {

    }
  })
  const handleKeepLogin = () => {
    setIsIdle(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await revokeSession(cookies.access_token, cookies.refresh_token);
    } catch (error) {
      console.error("Unable to revoke the server session", error);
    }
    dispatch(setUser(null));
    dispatch(setWallets([]));
    removeCookie("access_token", { path: "/" });
    removeCookie("refresh_token", { path: "/" });
    writeCompatibilityValue(localStorage, "beyvra:last-logout", Date.now().toString(), "codestra:last-logout");
    setIsIdle(false);
    navigate("/signIn", { replace: true });
  };



  const resetTimer = () => {
    try {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsIdle(true);
      }, idleTimeLimit);
    } catch (error) {

    }
  };

  useEffect(() => {
    if (bootstrap !== "USER_READY" && bootstrap !== "GUEST_READY") return;
    if (!isGuestDemo) mutateKYC({ token: cookies.access_token ?? "" });

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [bootstrap, cookies.access_token, mutateKYC, isGuestDemo]);

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
  if (allowedPortals?.length && !allowedPortals.some((portal) => sessionAllowedPortals.includes(portal))) {
    return <Navigate to={`/${sessionPortal === "client" ? "platform" : sessionPortal}`} replace />;
  }

  return (
    <>
      <Outlet />
      <Modal rootClassName="idle_warn_modal" open={isIdle} setOpen={() => { }} closeable={false} >
        <div className='confirmEmailContainer'>
          <span className='confirmEmailTitle'>Error</span>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <WarningIcon />
          </div>
          <span className='confirmEmailSubTitle' style={{ marginTop: 16 }}>Your account is idle</span>
          <button
            onClick={() => {
              setIsIdle(false);
              handleKeepLogin();
            }}
            className="confirmEmailContinueButton"
          >
            Reactivate
          </button>
          <button
            onClick={() => {
              setIsIdle(false);
              handleLogout();
            }}
            className="confirmEmailCancelButton"
          >
            Log out
          </button>
        </div>
      </Modal>
      <Modal rootClassName="idle_warn_modal" open={show} setOpen={() => { }}
        onCancel={() => setShow(false)}>
        <div className='confirmEmailContainer'>
          <span className='confirmEmailTitle'>Verification</span>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <img src="/menu-images//verification.png" style={{ width: 420 }} />
          </div>
          <span className='confirmEmailNote' style={{ marginTop: 16 }}>You don`t need to get verified for now. We`ll you know when you need to.</span>
          <div className='confirmEmailInputCotainer' style={{ height: 'max-content' }}>
            <span className='confirmEmailInputlabel' style={{ paddingTop: 16, paddingBottom: 16 }}>Verificarion is a mandatory process for financial market participants. Whith its help, we we`re able to create a safe space for trading where you can be sure that your funds are secure.</span>
          </div>
          <button
            onClick={() => {
              setShow(false);
            }}
            className="confirmEmailCancelButton"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default RequireAuth;
