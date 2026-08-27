import { Button, Form } from "antd";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { beyvraAuthApi } from "api/generated/beyvra";
import { authCookieOptions } from "security/authCookies";
import { BFF_GUEST_MARKER } from "security/bffSession";

interface SignInFormProps {
  setForgotPasswordView: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInForm: React.FunctionComponent<SignInFormProps> = ({ setForgotPasswordView }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [guestPending, setGuestPending] = useState(false);
  const [, setCookie] = useCookies(["access_token"]);
  const destination = new URLSearchParams(location.search).get("redirect")
    || (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    || "/platform";

  const beginLogin = () => {
    window.location.assign(beyvraAuthApi.loginUrl(destination));
  };

  const beginGuestDemo = async () => {
    if (guestPending) return;
    setGuestPending(true);
    try {
      const session = await beyvraAuthApi.guestDemo<{ expiresIn: number }>(crypto.randomUUID());
      // The browser does not retain the returned demo bearer. API calls use the
      // HttpOnly beyvra_access cookie issued by the backend.
      setCookie("access_token", BFF_GUEST_MARKER, {
        ...authCookieOptions(false),
        maxAge: session.expiresIn,
      });
      navigate(destination, { replace: true });
    } catch {
      toast.error("Demo access is temporarily unavailable. Please try again.");
    } finally {
      setGuestPending(false);
    }
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
      <button type="button" className="try-demo-button" onClick={beginGuestDemo} disabled={guestPending}>
        {guestPending ? "Starting demo…" : "Try Demo"}
      </button>
    </Form>
  );
};

export default SignInForm;
