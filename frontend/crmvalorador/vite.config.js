import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api/zenrows': {
        target: 'https://api.zenrows.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zenrows/, ''),
        proxyTimeout: 60000,
        timeout: 60000,
        configure: (proxy, options) => {
          // Log para verificar que la función 'configure' se llama
          console.log(`✨ [VITE PROXY] 'configure' function called for context path. Request will be proxied to: ${options.target}`);
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Solo log en desarrollo si es necesario para debugging
            if (process.env.VITE_DEBUG_PROXY === 'true') {
              const targetUrl = new URL(options.target); // options.target ya es la URL base de ZenRows
              // proxyReq.path ya incluye la parte de la URL que se añade a target (ej: /v1?apikey=...)
              console.log(`🔄 [VITE PROXY] Proxying to ZenRows: ${req.method} ${targetUrl.origin}${proxyReq.path}`);
            }
          })
          proxy.on('error', (err, req, res) => {
            console.error('❌ Error en el Proxy HTTP:', err);
            // Asegurarse de que la respuesta se envíe al cliente si es posible
            if (res && !res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify({ message: 'Error en el proxy', error: err.message }));
            }
          });
        }
      }
    }
  }
})
