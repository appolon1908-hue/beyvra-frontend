import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { useAppSelector } from "@store/hooks";
import { GlobalStates, setSignInTab } from "@store/slices/global";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import "./signIn.scss";

interface SignInProps {}

const SignIn: React.FunctionComponent<SignInProps> = () => {
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const { signInTab } = useAppSelector((state: { global: GlobalStates }) => state.global);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");

  useEffect(() => {
    if (requestedTab === "registration") dispatch(setSignInTab("2"));
    if (requestedTab === "login") dispatch(setSignInTab("1"));
  }, [dispatch, requestedTab]);

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
