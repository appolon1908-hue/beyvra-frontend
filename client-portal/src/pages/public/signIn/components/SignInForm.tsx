import { Checkbox, Form, Button } from "antd";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ISignInForm } from "@interfaces";
import { LoginSuccess, useLogin } from "api/user/useLogin";
import { useState } from "react";
import use2FAVerify from "api/user/use2FAVerify";
import { GlobalLoginMaxAge } from "App";
// import { useEffect } from "react";

interface SignInFormProps {
  setForgotPasswordView: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInForm: React.FunctionComponent<SignInFormProps> = ({
  setForgotPasswordView,
}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<LoginSuccess | null>(null);
  const [showOtp, setShowOTP] = useState(false);
  const [show, setShow] = useState(false);
  const [otp, setOTP] = useState('');
  const [, setCookie] = useCookies(["step", "access_token", "refresh_token",]);

  const { handleSubmit, register } = useForm<ISignInForm>();
  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      if (data.mfa_required) {
        setUserData(data);
        setShowOTP(true);
      }
      else {
        if (!data.access || !data.refresh || !data.user) return;
        setCookie("access_token", data.access, { maxAge: GlobalLoginMaxAge, secure: true, sameSite: "strict", path: "/" });
        setCookie("refresh_token", data.refresh, { secure: true, sameSite: "strict", path: "/" });
        setCookie("step", '');

        data.user.is_walkthrough ? navigate('/welcome') : navigate("/platform");
      }
    },

  });

  const { mutate: mutateVerify } = use2FAVerify({
    onSuccess: (data) => {
      if (!data.access || !data.refresh || !data.user) return;
      setCookie("access_token", data.access, { maxAge: GlobalLoginMaxAge, secure: true, sameSite: "strict", path: "/" });
      setCookie("refresh_token", data.refresh, { secure: true, sameSite: "strict", path: "/" });
      setCookie("step", '')

      data?.user?.is_walkthrough ? navigate('/welcome') : navigate("/platform");
    },
    onError: (error) => { },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return showOtp ?
    (
      <Form layout="vertical" onFinish={onSubmit} style={{ width: "300px" }}>
        <p className="forgotPass" style={{ textAlign: 'center' }}>
          Enter OTP from your registered authenticator app
        </p>
        <input
          className="loginInput"
          type="text"
          placeholder="XXXXXX"
          onChange={(e) => setOTP(e.target.value)} value={otp}
        />
        <Button
          className="login"
          type="primary"
          onClick={() => {
            mutateVerify({
              otp: otp,
              loginToken: userData?.login_token,
            })
          }}
          style={{ marginTop: 16 }}
        >
          Submit
        </Button>
      </Form>
    )
    : (
      <Form layout="vertical" onFinish={onSubmit} style={{ width: "300px" }}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <input
            className="loginInput"
            type="email"
            id="email"
            placeholder="Email"
            {...register("email")}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <input
            className="loginInput"
            type={show ? 'text' : "password"}
            id="password"
            placeholder="Password"
            {...register("password")}
          />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8, marginBottom: 16 }}>
          <span onClick={() => setShow(!show)} style={{ color: 'white', fontSize: 10, cursor: 'pointer' }}>{show ? 'Hide password' : 'Show password'}</span>
        </div>

        <Checkbox>Do not remember me</Checkbox>

        <p className="forgotPass" onClick={() => setForgotPasswordView(true)}>
          Forgot your password?
        </p>

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
