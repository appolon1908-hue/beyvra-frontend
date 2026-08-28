import { Button, Form } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import useResetPassword from "api/user/useResetPassword";

import "./resetPassword.scss";
import { useForm } from "react-hook-form";
import IResetPasswordForm from "@interfaces/IResetPasswordForm";
import { useState } from "react";
import { toast } from "react-toastify";

interface ResetPasswordProps {}

const ResetPassword: React.FunctionComponent<ResetPasswordProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const uidb64 = queryParams.get("uidb64") || queryParams.get("uid") || undefined;
  const token = queryParams.get("token") || undefined;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { handleSubmit, register, watch, formState: { errors } } = useForm<IResetPasswordForm>();
  const newPassword = watch("new_password", "");

  const { mutate, isPending } = useResetPassword({
    onSuccess: (data) => {
      toast.success(data.detail);
      setTimeout(() => {
        navigate("/signIn", { replace: true });
      }, 2000);
    },
    onError: () => { },
  });

  const onSubmit = handleSubmit((data) =>
    mutate({
      uidb64,
      token,
      data,
    })
  );

  return (
    <div className="resetPasswordContainer">
      <Form.Item>
        <p className="formTitle">Reset Password</p>
      </Form.Item>

      {!uidb64 || !token ? (
        <div style={{ width: "300px", textAlign: "center" }}>
          <p>This password reset link is incomplete or invalid.</p>
          <Button type="primary" onClick={() => navigate("/signIn", { replace: true })}>Return to login</Button>
        </div>
      ) : <Form layout="vertical" onFinish={onSubmit} style={{ width: "300px" }}>
        <Form.Item
          validateStatus={errors.new_password ? "error" : undefined}
          help={errors.new_password?.message}
        >
          <input
            className="customInput"
            type={passwordVisible ? "text" : "password"}
            id="new_password"
            placeholder="New Password"
            autoComplete="new-password"
            {...register("new_password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
              maxLength: { value: 20, message: "Use no more than 20 characters" },
            })}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.new_password_confirm ? "error" : undefined}
          help={errors.new_password_confirm?.message}
        >
          <input
            className="customInput"
            type={passwordVisible ? "text" : "password"}
            id="new_password_confirm"
            placeholder="Confirm Password"
            autoComplete="new-password"
            {...register("new_password_confirm", {
              required: "Please confirm your password",
              validate: (value) => value === newPassword || "Passwords do not match",
            })}
          />
        </Form.Item>
        <div className="showPassContainer">
          <Button
            type="link"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="showPassButton"
          >
            {passwordVisible ? "Hide Password" : "Show Password"}
          </Button>
        </div>

        <Button
          className="confirmButton"
          type="primary"
          htmlType="submit"
          loading={isPending}
        >
          Change Password
        </Button>
      </Form>}
    </div>
  );
};

export default ResetPassword;
