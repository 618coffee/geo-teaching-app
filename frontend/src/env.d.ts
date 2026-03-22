/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_MODE?: 'local' | 'remote';
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
