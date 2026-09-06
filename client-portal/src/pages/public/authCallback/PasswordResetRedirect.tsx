import { useEffect } from "react";
import { beyvraAuthApi } from "api/generated/beyvra";

const PasswordResetRedirect = () => {
  useEffect(() => {
    window.location.replace(beyvraAuthApi.passwordResetUrl());
  }, []);
  return <main className="route-bootstrap" role="status" aria-live="polite">Opening secure account recovery…</main>;
};

export default PasswordResetRedirect;
