import { Button, Form } from "antd";

import { beyvraAuthApi } from "api/generated/beyvra";

const SignUpForm = () => {
  const beginRegistration = () => {
    window.location.assign(beyvraAuthApi.registrationUrl("/platform"));
  };

  return (
    <Form layout="vertical" style={{ width: "300px" }}>
      <div className="registration-intro">
        <h2>Create your Beyvra account</h2>
        <p>
          Registration, email verification, password setup, and MFA are handled
          by the secure identity service. Beyvra never receives your password.
        </p>
      </div>
      <p className="info-text">
        The secure registration flow includes the current <a href="/terms" target="_blank" rel="noreferrer">service agreement</a> and
        <a href="/privacy" target="_blank" rel="noreferrer"> privacy notice</a>.
      </p>
      <Button type="primary" className="login" onClick={beginRegistration}>
        Continue to secure registration
      </Button>
    </Form>
  );
};

export default SignUpForm;
