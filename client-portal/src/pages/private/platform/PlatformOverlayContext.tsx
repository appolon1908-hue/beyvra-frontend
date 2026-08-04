import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type PlatformOverlay =
  | { type: "none" }
  | { type: "market" }
  | { type: "trade" }
  | { type: "profile" };

type PlatformOverlayContextValue = {
  overlay: PlatformOverlay;
  openOverlay: (type: Exclude<PlatformOverlay["type"], "none">) => void;
  closeOverlay: () => void;
};

const PlatformOverlayContext = createContext<PlatformOverlayContextValue | null>(null);

export function PlatformOverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<PlatformOverlay>({ type: "none" });
  const openOverlay = useCallback((type: Exclude<PlatformOverlay["type"], "none">) => {
    setOverlay({ type });
  }, []);
  const closeOverlay = useCallback(() => setOverlay({ type: "none" }), []);
  const value = useMemo(() => ({ overlay, openOverlay, closeOverlay }), [overlay, openOverlay, closeOverlay]);
  return <PlatformOverlayContext.Provider value={value}>{children}</PlatformOverlayContext.Provider>;
}

export function usePlatformOverlay() {
  const value = useContext(PlatformOverlayContext);
  if (!value) throw new Error("usePlatformOverlay must be used inside PlatformOverlayProvider");
  return value;
}
