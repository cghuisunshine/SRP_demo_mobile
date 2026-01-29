/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Vite/Astro base URL (e.g. "/SRP_demo_mobile/") */
  readonly BASE_URL: string;

  /** treat as localhost:3000 if not set */
  readonly PUBLIC_HOST: string | undefined;

  /** Enable in-browser mock API for static/demo deploys (e.g. GitHub Pages) */
  readonly PUBLIC_DEMO_MODE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
