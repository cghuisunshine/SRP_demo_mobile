import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project sites need a base path (e.g. /SRP_demo_mobile)
  base: process.env.BASE_PATH ?? '/',
  integrations: [tailwind(), react()],
});
