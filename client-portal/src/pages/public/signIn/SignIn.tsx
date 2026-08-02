import React, { useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";

import "./signIn.scss";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { withTranslation } from "react-i18next";
import { useAppSelector } from "@store/hooks";
import { GlobalStates, setSignInTab } from "@store/slices/global";
import { useDispatch } from "react-redux";

interface SignInProps { }

const SignIn: React.FunctionComponent<SignInProps> = () => {
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const { signInTab } = useAppSelector(
    (state: { global: GlobalStates }) => state.global
  );

  const dispatch = useDispatch()

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <span className={signInTab === "1" ? "auth-tab-active" : ""}>Login</span>,
      children: <SignInForm setForgotPasswordView={setForgotPasswordView} />,
    },
    {
      key: "2",
      label: <span className={signInTab === "2" ? "auth-tab-active" : ""}>Registration</span>,
      children: <SignUpForm />,
    },
  ];

  console.log(signInTab);
  return (
    <div className="loginContainer">
      <div className="centerWrapper">
        {forgotPasswordView ? (
          <ForgotPasswordForm />
        ) : (
          <Tabs
            centered
            activeKey={signInTab}
            items={items}
            indicatorSize={150}
            tabBarGutter={100}
            onChange={(key) => dispatch(setSignInTab(key))}
          />
        )}
      </div>
    </div>
  );
};

export default withTranslation()(SignIn);
