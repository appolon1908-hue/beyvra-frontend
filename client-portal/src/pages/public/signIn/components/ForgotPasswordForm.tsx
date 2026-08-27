import { Button, Form } from "antd";

import { beyvraAuthApi } from "api/generated/beyvra";

const ForgotPasswordForm = () => {
  const beginRecovery = () => {
    window.location.assign(beyvraAuthApi.passwordResetUrl());
  };

  return (
    <Form className="forgotPassContainer" layout="vertical" style={{ width: "300px" }}>
      <p className="info-text">
        Continue to the secure identity service. It always shows the same
        response whether or not an account exists, and Beyvra never receives
        the reset token or your new password.
      </p>
      <Button className="login" type="primary" onClick={beginRecovery}>
        Continue to secure recovery
      </Button>
    </Form>
  );
};

export default ForgotPasswordForm;
