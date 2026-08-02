export default function getEnv(name: string) {
  if (name === "VITE_API_BASE_URL") {
    const BASE_URL = `/api`;
    return (
      (window as any)?.configs?.[name] ||
      ((import.meta as any).env[name] as string) ||
      BASE_URL
    );
  }
  if (name === "VITE_SOCKET_BASE_URL") {
    const BASE_URL = `AUTO`;
    const configured = (
      (window as any)?.configs?.[name] ||
      ((import.meta as any).env[name] as string) ||
      BASE_URL
    );
    if (configured === "AUTO") {
      return `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;
    }
    return configured;
  }
  return (
    (window as any)?.configs?.[name] ||
    ((import.meta as any).env[name] as string)
  );
}

export const getApiUrl = (path: string) => {
  const base = getEnv("VITE_API_BASE_URL").replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

export const getSocketUrl = (path: string, params?: Record<string, string | number>) => {
  const base = getEnv("VITE_SOCKET_BASE_URL").replace(/\/$/, "");
  const url = new URL(`${base}/${path.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(params || {})) url.searchParams.set(key, String(value));
  return url.toString();
};
