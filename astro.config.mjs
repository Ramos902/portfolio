import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ramos902.github.io',
  base: '/portfolio',
  integrations: [sitemap()],
});