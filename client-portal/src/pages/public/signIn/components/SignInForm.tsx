import { Button, Form } from "antd";
import { useLocation } from "react-router-dom";

import { beyvraAuthApi } from "api/generated/beyvra";

interface SignInFormProps {
  setForgotPasswordView: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInForm: React.FunctionComponent<SignInFormProps> = ({ setForgotPasswordView }) => {
  const location = useLocation();
  const destination = new URLSearchParams(location.search).get("redirect")
    || (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    || "/platform";

  const beginLogin = () => {
    window.location.assign(beyvraAuthApi.loginUrl(destination));
  };

  return (
    <Form layout="vertical" style={{ width: "300px" }}>
      <p className="info-text">
        Continue to Beyvra's secure identity service to sign in. Your password
        and authentication codes are never entered into this application.
      </p>
      <Button className="login" type="primary" onClick={beginLogin}>
        Continue to secure login
      </Button>
      <button type="button" className="forgotPass" onClick={() => setForgotPasswordView(true)}>
        Forgot your password?
      </button>
      <div className="auth-divider" aria-hidden="true"><span>Or</span></div>
      <button type="button" className="try-demo-button" onClick={beginLogin}>
        Practice with a paper account
      </button>
    </Form>
  );
};

export default SignInForm;
