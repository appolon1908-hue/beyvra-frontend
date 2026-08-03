import useRefreshToken from "api/user/useRefreshToken";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";
import { setWallets } from "@store/slices/wallet";

import Modal from "components/modal/Modal";
import WarningIcon from "assets/icons/WarningIcon";

import "./styles.scss";
import { GlobalLoginMaxAge } from "App";
import useKyc from "api/kyc/useKycInfo";
import { revokeSession } from "api/user/logout";


const idleTimeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
const kycTimeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds
let timeoutId: NodeJS.Timeout;

const RequireAuth = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);
  const [show, setShow] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

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
  const { mutate } = useRefreshToken({
    onSuccess: () => { },
    onError: (error: any) => {
      console.error("error refreshing the token", error?.refresh);
      removeCookie("access_token", { path: "/" });
      removeCookie("refresh_token", { path: "/" });
      navigate("/session-expired", { replace: true, state: { from: location } });
    },
  });

  const handleKeepLogin = () => {
    mutate(
      { refresh: cookies.refresh_token },
      {
        onSuccess: (data) => {
          setCookie("access_token", data.access, { maxAge: GlobalLoginMaxAge });
          setIsIdle(false);
          window.location.reload();
        },
      }
    );
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
    localStorage.setItem("codestra:last-logout", Date.now().toString());
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
    mutateKYC({
      token: cookies.access_token
    });
    // Set up event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    // Start the timer when the component mounts
    resetTimer();

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [cookies.access_token, mutateKYC]);

  useEffect(() => {
    if (cookies?.access_token) {
      const refreshInterval = 4 * 60 * 1000;

      const refresh = () => {
        mutate(
          { refresh: cookies.refresh_token },
          {
            onSuccess: (data) => {
              setCookie("access_token", data.access, { maxAge: GlobalLoginMaxAge });
            },
          }
        );
      };

      const tokenPayload = JSON.parse(
        atob(cookies?.access_token?.split(".")[1])
      );
      const tokenExpirationTime = new Date(tokenPayload?.exp * 1000);
      const currentTime = new Date();
      const timeUntilExpiration =
        tokenExpirationTime.getTime() - currentTime.getTime();

      if (timeUntilExpiration <= 24 * 1000) {
        refresh();
      }

      const intervalId = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [cookies?.access_token, cookies.refresh_token, mutate, setCookie]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "codestra:last-logout") return;
      dispatch(setUser(null));
      dispatch(setWallets([]));
      removeCookie("access_token", { path: "/" });
      removeCookie("refresh_token", { path: "/" });
      navigate("/signIn?tab=login", { replace: true });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch, navigate, removeCookie]);

  if (!cookies.access_token) {
    return <Navigate to="/signIn" state={{ from: location }} />;
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
