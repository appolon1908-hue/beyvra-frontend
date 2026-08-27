import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";

import { beyvraAuthApi } from "api/generated/beyvra";
import { authCookieOptions } from "security/authCookies";
import { BFF_SESSION_MARKER } from "security/bffSession";

const ALLOWED_DESTINATIONS = new Set([
  "/platform",
  "/platform/trades",
  "/platform/profile",
  "/platform/settings",
]);

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [, setCookie] = useCookies(["access_token", "refresh_token"]);
  const [error, setError] = useState(searchParams.get("error") ? "We could not complete sign-in." : "");

  useEffect(() => {
    if (searchParams.get("error")) return;
    let cancelled = false;
    beyvraAuthApi.session<{ state?: string }>()
      .then((session) => {
        if (cancelled || session.state !== "user.ready") throw new Error("SESSION_BOOTSTRAP_FAILED");
        // This JavaScript-readable value is deliberately non-secret. The real
        // access and refresh tokens remain in Secure/HttpOnly backend cookies.
        setCookie("access_token", BFF_SESSION_MARKER, authCookieOptions(false));
        const requested = searchParams.get("next") || "/platform";
        window.location.replace(ALLOWED_DESTINATIONS.has(requested) ? requested : "/platform");
      })
      .catch(() => {
        if (!cancelled) setError("We could not establish your Beyvra session. Please try again.");
      });
    return () => { cancelled = true; };
  }, [searchParams, setCookie]);

  if (error) {
    return <main className="route-bootstrap route-bootstrap--error"><h1>Sign-in failed</h1><p>{error}</p><a href="/signIn?tab=login">Back to login</a></main>;
  }
  return <main className="route-bootstrap" role="status" aria-live="polite">Completing secure sign-in…</main>;
};

export default AuthCallback;
