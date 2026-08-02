import { useState } from "react";
import { Form, Button } from "antd";
import { useForm } from "react-hook-form";

import useFrogotPassowrd from "api/user/useForgotPassword";
import { CheckIconLarge } from "assets/icons/CheckIconLarge";

const ForgotPasswordForm = () => {
  const { handleSubmit, register, formState: { errors } } = useForm<{ email: string }>();
  const [emailSent, setEmailSent] = useState(false);

  const { mutate, isPending } = useFrogotPassowrd({
    onSuccess: () => {
      setEmailSent(true);
    },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  const EmailSent = () => (
    <div className="emailSentContainer">
      <CheckIconLarge />
      <p>
        We've sent an email containing password recovery instructions to the
        address you provided. If you don't see it, be sure to check your Spam
        folder.
      </p>
    </div>
  );

  return (
    <>
      {emailSent ? (
        <EmailSent />
      ) : (
        <Form
          className="forgotPassContainer"
          layout="vertical"
          onFinish={onSubmit}
          style={{ width: "300px" }}
        >
          <p className="info-text">
            Please enter the email address you used to register the account and
            we will send you a link to reset your password.
          </p>

          <Form.Item validateStatus={errors.email ? "error" : undefined} help={errors.email?.message}>
            <input
              className="loginInput"
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
            />
          </Form.Item>

          <Button
            className="login"
            type="primary"
            htmlType="submit"
            loading={isPending}
            disabled={emailSent}
          >
            Restore
          </Button>
        </Form>
      )}
    </>
  );
};

export default ForgotPasswordForm;
