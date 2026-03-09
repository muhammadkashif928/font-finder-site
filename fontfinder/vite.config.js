import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        browse:  resolve(__dirname, 'browse.html'),
        guides:  resolve(__dirname, 'guides.html'),
        blog:    resolve(__dirname, 'blog.html'),
        about:   resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms:      resolve(__dirname, 'terms.html'),
        'blog-post': resolve(__dirname, 'blog-post.html'),
      },
    },
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
