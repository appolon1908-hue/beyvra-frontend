/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOIP_ENDPOINT?: string;
  readonly VITE_REALTIME_V2_ENABLED?: string;
  readonly VITE_REALTIME_V2_V1_FALLBACK_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
