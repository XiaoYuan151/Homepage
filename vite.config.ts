import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  base: process.env.VITE_BASE || '/',
  plugins: [svelte()],
}));
