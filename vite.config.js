import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import rawPlugin from './vite-plugin-raw'; // Ensure this path is correct

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    rawPlugin() // Register the custom plugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
