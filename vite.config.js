import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';

const demoOnly = process.env.VITE_DEMO_ONLY === 'true';

export default defineConfig({
  base: demoOnly ? '/IQuote/' : '/',
  plugins: [react()],
  server: { proxy: { '/api': 'http://127.0.0.1:3001' } }
});
