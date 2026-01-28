import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ASVIAN - Gestión de Mantenimiento',
        short_name: 'ASVIAN',
        description: 'Sistema de Gestión de Mantenimiento para el Parque Comercial Albán',
        theme_color: '#1e40af',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        // Excluir rutas que no deben usar el fallback de navegación
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/auth/,
          /^\/login/,
          /supabase/,
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          // IMPORTANTE: Nunca cachear peticiones a Supabase
          {
            urlPattern: ({ url }) => url.hostname.includes('supabase'),
            handler: 'NetworkOnly',
          },
          // Navegación: siempre intentar red primero, con timeout corto
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1 día
              },
            },
          },
          // Assets estáticos: caché primero
          {
            urlPattern: ({ request }) =>
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          }
        ]
      },
      devOptions: {
        enabled: false, // SW DESACTIVADO en desarrollo - causa conflictos con HMR
        type: 'module'
      }
    })
  ],
})
