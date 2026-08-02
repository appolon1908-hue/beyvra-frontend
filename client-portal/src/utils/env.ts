export default function getEnv(name: string) {
  if (name === "VITE_API_BASE_URL") {
    const BASE_URL = `https://tradx.io/api`;
    return (
      (window as any)?.configs?.[name] ||
      ((import.meta as any).env[name] as string) ||
      BASE_URL
    );
  }
  if (name === "VITE_SOCKET_BASE_URL") {
    const BASE_URL = `wss://tradx.io/`;
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
