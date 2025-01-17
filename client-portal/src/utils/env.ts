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
    return BASE_URL;
  }
  return (
    (window as any)?.configs?.[name] ||
    ((import.meta as any).env[name] as string)
  );
}
