import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

function blinkCleanUrlsPlugin() {
  const routes = {
    '/blinkgleba': '/blinkgleba/index.html',
    '/blinkgleba/': '/blinkgleba/index.html',
    '/blinkcentro': '/blinkcentro/index.html',
    '/blinkcentro/': '/blinkcentro/index.html',
    '/blinkmaringa': '/blinkmaringa/index.html',
    '/blinkmaringa/': '/blinkmaringa/index.html',
  };

  const attachRewrite = (middlewares) => {
    middlewares.use((req, _res, next) => {
      if (req.url) {
        const cleanPath = req.url.split('?')[0];
        if (routes[cleanPath]) {
          const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
          req.url = routes[cleanPath] + query;
        }
      }
      next();
    });
  };

  return {
    name: 'blink-clean-urls',
    configureServer(server) {
      attachRewrite(server.middlewares);
    },
    configurePreviewServer(server) {
      attachRewrite(server.middlewares);
    },
    closeBundle() {
      ['blinkgleba', 'blinkcentro', 'blinkmaringa'].forEach((slug) => {
        const src = resolve(__dirname, 'dist', slug, 'index.html');
        const dest = resolve(__dirname, 'dist', `${slug}.html`);
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [blinkCleanUrlsPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        obrigado: resolve(__dirname, 'obrigado.html'),
        blinkgleba: resolve(__dirname, 'blinkgleba/index.html'),
        blinkcentro: resolve(__dirname, 'blinkcentro/index.html'),
        blinkmaringa: resolve(__dirname, 'blinkmaringa/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
