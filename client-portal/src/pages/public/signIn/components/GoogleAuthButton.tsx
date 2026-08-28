import { useEffect, useState } from "react";
import { beyvraAuthApi } from "api/generated/beyvra";
import { beginOidcAuthIfEnabled, fetchOidcConfig, isOidcEnabled } from "api/auth/oidc";

type GoogleAuthButtonProps = {
  action: "login" | "register";
  legalAccepted?: boolean;
};

export default function GoogleAuthButton({ action, legalAccepted = false }: GoogleAuthButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [usesOidc, setUsesOidc] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    fetchOidcConfig()
      .then(async (config) => {
        if (!active) return;
        if (isOidcEnabled(config)) {
          setUsesOidc(true);
          setEnabled(true);
          return;
        }
        const result = await beyvraAuthApi.providers<{ google?: { enabled?: boolean } }>();
        if (active) setEnabled(result?.google?.enabled === true);
      })
      .catch(() => { if (active) setEnabled(false); });
    return () => { active = false; };
  }, []);
  const providerUnavailable = enabled !== true;
  const disabled = state === "loading" || (action === "register" && !legalAccepted);

  const begin = async () => {
    if (disabled || providerUnavailable) return;
    setState("loading");
    try {
      if (usesOidc && await beginOidcAuthIfEnabled(action, legalAccepted)) return;
      const result = await beyvraAuthApi.googleStart<{ authorizationUrl?: string; code?: string }>({ action, legalConfirmed: action === "register" ? legalAccepted : false, returnPath: "/platform" });
      if (!result.authorizationUrl) throw new Error(result.code || "GOOGLE_AUTH_FAILED");
      window.location.assign(result.authorizationUrl);
    } catch {
      setState("error");
    }
  };

  return (
    <div className="google-auth-control">
      <button type="button" className="google-auth-button" onClick={begin} disabled={disabled || providerUnavailable} aria-busy={state === "loading"}>
        <span className="google-auth-mark" aria-hidden="true">G</span>
        <span>{enabled === null ? "Checking sign-in…" : providerUnavailable ? "Google sign-in unavailable" : state === "loading" ? "Connecting…" : usesOidc ? "Continue securely" : "Continue with Google"}</span>
      </button>
      {action === "register" && !legalAccepted && <p className="google-auth-hint" role="status">Accept the Service Agreement to continue with Google.</p>}
      {state === "error" && <p className="google-auth-error" role="alert">Google authentication could not be started. Please try again.</p>}
      {enabled === false && <p className="google-auth-hint" role="status">Google authentication is not configured for this staging environment.</p>}
    </div>
  );
}
