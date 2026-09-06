import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { revokeSession } from "api/user/logout";
import { writeCompatibilityValue } from "compat/storageKeys";

const AuthLogout = () => {
  const [, , removeCookie] = useCookies(["access_token", "refresh_token"]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    revokeSession()
      .then((logoutUrl) => {
        if (cancelled) return;
        removeCookie("access_token", { path: "/" });
        removeCookie("refresh_token", { path: "/" });
        writeCompatibilityValue(localStorage, "beyvra:last-logout", Date.now().toString(), "codestra:last-logout");
        window.location.replace(logoutUrl || "/signIn?logged_out=1");
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => { cancelled = true; };
  }, [removeCookie]);

  if (failed) return <main className="route-bootstrap route-bootstrap--error"><h1>Logout unavailable</h1><p>Please retry so your identity-provider session is also closed.</p><button onClick={() => window.location.reload()}>Retry</button></main>;
  return <main className="route-bootstrap" role="status" aria-live="polite">Signing out securely…</main>;
};

export default AuthLogout;
