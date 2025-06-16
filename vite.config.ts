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
  server: {
    proxy: {
      // Все запросы к /api будут проксироваться на твой бэкенд
      '/api': {
        target: 'http://89.111.169.69:3000',
        changeOrigin: true,
        // Перезаписывает путь, если нужно (например, оставляет /api)
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // Можно закомментировать, если не требуется переписывать путь
      },
    },
  },
});
