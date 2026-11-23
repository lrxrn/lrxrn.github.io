import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: '/',
  // 404.html is served by GitHub Pages for any unknown path
  build: { rollupOptions: { input: { main: 'index.html', notfound: '404.html' } } },
})
