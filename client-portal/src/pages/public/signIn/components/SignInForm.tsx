import { Checkbox, Form, Button } from "antd";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ISignInForm } from "@interfaces";
import { LoginResponse, useLogin } from "api/user/useLogin";
import { useState } from "react";
import use2FAVerify from "api/user/use2FAVerify";
import { authCookieOptions } from "security/authCookies";
// import { useEffect } from "react";

interface SignInFormProps {
  setForgotPasswordView: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInForm: React.FunctionComponent<SignInFormProps> = ({
  setForgotPasswordView,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const [showOtp, setShowOTP] = useState(false);
  const [show, setShow] = useState(false);
  const [otp, setOTP] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [, setCookie] = useCookies(["step", "access_token", "refresh_token",]);

  const { handleSubmit, register, formState: { errors } } = useForm<ISignInForm>();
  const destination = new URLSearchParams(location.search).get("redirect") || (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const finishLogin = (data: LoginResponse) => {
    if (!data.access || !data.refresh || !data.user) {
      return;
    }
    const cookieOptions = authCookieOptions(rememberMe);
    setCookie("access_token", data.access, cookieOptions);
    setCookie("refresh_token", data.refresh, cookieOptions);
    setCookie("step", "", cookieOptions);
    navigate(destination || (data.user.is_walkthrough ? "/walkThrough" : "/platform"), { replace: true });
  };
  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      if (data.mfa_required) {
        setUserData(data);
        setShowOTP(true);
      }
      else {
        finishLogin(data);
      }
    },

  });

  const { mutate: mutateVerify, isPending: isVerifying } = use2FAVerify({
    onSuccess: (data) => {
      finishLogin(data);
    },
    onError: () => { },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return showOtp ?
    (
      <Form layout="vertical" onFinish={() => undefined} style={{ width: "300px" }}>
        <p className="forgotPass" style={{ textAlign: 'center' }}>
          Enter OTP from your registered authenticator app
        </p>
        <input
          className="loginInput"
          type="text"
          placeholder="XXXXXX"
          onChange={(e) => setOTP(e.target.value)} value={otp}
          inputMode="numeric"
          maxLength={6}
          aria-label="Authenticator code"
        />
        <Button
          className="login"
          type="primary"
          onClick={() => {
            if (isVerifying || !userData?.login_token || !/^\d{6}$/.test(otp)) return;
            mutateVerify({
              otp: otp,
              loginToken: userData.login_token,
            })
          }}
          style={{ marginTop: 16 }}
        >
          {isVerifying ? "Verifying..." : "Submit"}
        </Button>
      </Form>
    )
    : (
      <Form layout="vertical" onFinish={onSubmit} style={{ width: "300px" }}>
        <Form.Item
          validateStatus={errors.email ? "error" : undefined}
          help={errors.email?.message}
        >
          <label htmlFor="email">Email</label>
          <input
            className="loginInput"
            type="email"
            id="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", { required: "Email is required" })}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.password ? "error" : undefined}
          help={errors.password?.message}
        >
          <label htmlFor="password">Password</label>
          <input
            className="loginInput"
            type={show ? 'text' : "password"}
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
          />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8, marginBottom: 16 }}>
          <button
            type="button"
            aria-pressed={show}
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow(!show)}
            style={{ background: "transparent", color: "white", fontSize: 12, cursor: "pointer" }}
          >
            {show ? 'Hide password' : 'Show password'}
          </button>
        </div>

        <Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}>
          Keep me signed in
        </Checkbox>

        <button type="button" className="forgotPass" onClick={() => setForgotPasswordView(true)}>
          Forgot your password?
        </button>

        <Button
          className="login"
          type="primary"
          htmlType="submit"
          loading={isPending}
        >
          Log In
        </Button>

      </Form>
    );
};

export default SignInForm;
