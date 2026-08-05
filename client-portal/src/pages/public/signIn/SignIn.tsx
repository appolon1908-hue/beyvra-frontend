import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";

import "./signIn.scss";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { useTranslation, withTranslation } from "react-i18next";
import { useAppSelector } from "@store/hooks";
import { GlobalStates, setSignInTab } from "@store/slices/global";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { codestraAuthApi } from "api/generated/codestraDemo";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { GlobalLoginMaxAge } from "App";

interface SignInProps { }

const SignIn: React.FunctionComponent<SignInProps> = () => {
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const { signInTab } = useAppSelector(
    (state: { global: GlobalStates }) => state.global
  );

  const dispatch = useDispatch()
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setCookie] = useCookies(["access_token", "refresh_token", "step"]);
  const requestedTab = searchParams.get("tab");

  useEffect(() => {
    if (requestedTab === "registration") dispatch(setSignInTab("2"));
    if (requestedTab === "login") dispatch(setSignInTab("1"));
  }, [dispatch, requestedTab]);

  useEffect(() => {
    const ticket = searchParams.get("google_ticket");
    const authError = searchParams.get("auth_error");
    if (authError) {
      toast.error("We could not complete Google authentication. Please try again.");
      searchParams.delete("auth_error");
      setSearchParams(searchParams, { replace: true });
      return;
    }
    if (!ticket) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await codestraAuthApi.googleCredential<{ access?: string; refresh?: string; user?: { is_walkthrough?: boolean } }>(ticket);
        if (!result.access || !result.refresh) throw new Error("GOOGLE_TICKET_INVALID");
        if (cancelled) return;
        const cookieOptions = { maxAge: GlobalLoginMaxAge, secure: true, sameSite: "strict" as const, path: "/" };
        setCookie("access_token", result.access, cookieOptions);
        setCookie("refresh_token", result.refresh, cookieOptions);
        setCookie("step", "", cookieOptions);
        searchParams.delete("google_ticket");
        setSearchParams(searchParams, { replace: true });
        window.location.assign(result.user?.is_walkthrough ? "/walkThrough" : "/platform");
      } catch {
        if (!cancelled) toast.error("We could not complete Google authentication. Please try again.");
      }
    })();
    return () => { cancelled = true; };
  }, [searchParams, setCookie, setSearchParams]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <span className={signInTab === "1" ? "auth-tab-active" : ""}>{t("login")}</span>,
      children: <SignInForm setForgotPasswordView={setForgotPasswordView} />,
    },
    {
      key: "2",
      label: <span className={signInTab === "2" ? "auth-tab-active" : ""}>{t("registration")}</span>,
      children: <SignUpForm />,
    },
  ];

  return (
    <div className="loginContainer">
      <div className="centerWrapper">
        <div className="authBranding">
          <span className="authEyebrow">{t("authPracticePlatform")}</span>
          <h1>{t("authWelcomeBack")}</h1>
          <p>{t("authContinueDemo")}</p>
        </div>
        {forgotPasswordView ? (
          <ForgotPasswordForm />
        ) : (
          <Tabs
            centered
            activeKey={signInTab}
            items={items}
            indicatorSize={150}
            tabBarGutter={100}
            onChange={(key) => {
              dispatch(setSignInTab(key));
              setSearchParams({ tab: key === "2" ? "registration" : "login" }, { replace: true });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default withTranslation()(SignIn);
