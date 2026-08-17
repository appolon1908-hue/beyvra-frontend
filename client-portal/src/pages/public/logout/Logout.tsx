import { useEffect, useRef } from "react";

import useLogout from "hooks/useLogout";

const Logout = () => {
  const { logout } = useLogout();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void logout();
  }, [logout]);

  return (
    <main className="route-bootstrap" role="status" aria-live="polite">
      Signing you out…
    </main>
  );
};

export default Logout;
