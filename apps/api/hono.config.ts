import { defineConfig } from 'hono';

export default defineConfig({
  // Hono configuration options
  port: process.env.PORT || 3001,
  hostname: '0.0.0.0',
});
