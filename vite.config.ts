import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/vinyl-tracker/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vinyl Tracker',
        short_name: 'Vinyl',
        description: 'Track your vinyl record collection offline',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          { src: '/vinyl-tracker/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/vinyl-tracker/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/vinyl-tracker/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
