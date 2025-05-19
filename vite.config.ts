// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Импортируем необходимые функции из модуля 'url'
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Другие настройки...
});
