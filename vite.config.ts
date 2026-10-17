import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: [],
    external: ['proper-lockfile', 'bcrypt', 'nodemailer', 'puppeteer', 'pino', 'pino-http'],
  },
  test: {
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    environment: 'node',
  },
});
