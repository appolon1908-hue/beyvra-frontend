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
  const uidb64 = queryParams.get("uidb64") || undefined;
  const token = queryParams.get("token") || undefined;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { handleSubmit, register } = useForm<IResetPasswordForm>();

  const { mutate, isPending } = useResetPassword({
    onSuccess: (data) => {
      toast.success(data.detail);
      setTimeout(() => {
        navigate("/platform");
      }, 2000);
    },
    onError: (error) => {
      console.log("error", error);
    },
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

      <Form layout="vertical" onFinish={onSubmit} style={{ width: "300px" }}>
        <Form.Item
          name="new_password"
          rules={[{ required: true, message: "Required" }]}
        >
          <input
            className="customInput"
            type={passwordVisible ? "text" : "password"}
            id="new_password"
            placeholder="New Password"
            {...register("new_password")}
          />
        </Form.Item>

        <Form.Item
          name="new_password_confirm"
          rules={[{ required: true, message: "Required" }]}
        >
          <input
            className="customInput"
            type={passwordVisible ? "text" : "password"}
            id="new_password_confirm"
            placeholder="Confirm Password"
            {...register("new_password_confirm")}
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
      </Form>
    </div>
  );
};

export default ResetPassword;
