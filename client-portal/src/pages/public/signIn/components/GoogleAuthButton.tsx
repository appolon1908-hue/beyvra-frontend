import { useEffect, useState } from "react";
import { getApiUrl } from "utils/env";

type GoogleAuthButtonProps = {
  action: "login" | "register";
  legalAccepted?: boolean;
};

export default function GoogleAuthButton({ action, legalAccepted = false }: GoogleAuthButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    fetch(getApiUrl("v1/auth/providers"), { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (active) setEnabled(result?.google?.enabled === true); })
      .catch(() => { if (active) setEnabled(false); });
    return () => { active = false; };
  }, []);
  const providerUnavailable = enabled !== true;
  const disabled = state === "loading" || (action === "register" && !legalAccepted);

  const begin = async () => {
    if (disabled || providerUnavailable) return;
    setState("loading");
    try {
      const response = await fetch(getApiUrl("v1/auth/google/start"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, legalConfirmed: action === "register" ? legalAccepted : false, returnPath: "/platform" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.authorizationUrl) throw new Error(result.code || "GOOGLE_AUTH_FAILED");
      window.location.assign(result.authorizationUrl);
    } catch {
      setState("error");
    }
  };

  return (
    <div className="google-auth-control">
      <button type="button" className="google-auth-button" onClick={begin} disabled={disabled || providerUnavailable} aria-busy={state === "loading"}>
        <span className="google-auth-mark" aria-hidden="true">G</span>
        <span>{enabled === null ? "Checking Google sign-in…" : providerUnavailable ? "Google sign-in unavailable" : state === "loading" ? "Connecting…" : "Continue with Google"}</span>
      </button>
      {action === "register" && !legalAccepted && <p className="google-auth-hint" role="status">Accept the Service Agreement to continue with Google.</p>}
      {state === "error" && <p className="google-auth-error" role="alert">Google authentication could not be started. Please try again.</p>}
      {enabled === false && <p className="google-auth-hint" role="status">Google authentication is not configured for this staging environment.</p>}
    </div>
  );
}
