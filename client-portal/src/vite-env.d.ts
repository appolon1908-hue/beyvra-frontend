/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SOCKET_BASE_URL?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_BRAND_NAME?: string;
  readonly VITE_GEOIP_ENDPOINT?: string;
  readonly VITE_REALTIME_V2_ENABLED?: string;
  readonly VITE_REALTIME_V2_V1_FALLBACK_ENABLED?: string;
  readonly VITE_DEPLOYMENT_READ_ONLY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
