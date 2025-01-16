import { Checkbox, Form, Button } from "antd";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ISignInForm } from "@interfaces";
import { useLogin } from "api/user/useLogin";
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
  const [userData, setUserData] = useState(null);
  const [showOtp, setShowOTP] = useState(false);
  const [show, setShow] = useState(false);
  const [otp, setOTP] = useState('');
  const [, setCookie] = useCookies(["step", "access_token", "refresh_token",]);

  const { handleSubmit, register } = useForm<ISignInForm>();
  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      if (data?.user?.two_factor_authentication_enabled) {
        setUserData(data);
        setShowOTP(true);
      }
      else {
        setCookie("access_token", data.access, { maxAge: GlobalLoginMaxAge });
        setCookie("refresh_token", data.refresh);
        setCookie("step", '');

        data?.user.is_walkthrough ? navigate('/welcome') : navigate("/platform");
      }
    },

  });

  const { mutate: mutateVerify } = use2FAVerify({
    onSuccess: (data) => {
      setCookie("access_token", userData?.access, { maxAge: GlobalLoginMaxAge });
      setCookie("refresh_token", userData?.refresh);
      setCookie("step", '')

      userData?.user.is_walkthrough ? navigate('/welcome') : navigate("/platform");
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
              token: userData?.access,
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
