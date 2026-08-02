/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOIP_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
