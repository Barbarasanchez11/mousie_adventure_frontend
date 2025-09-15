import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Ratoncito Pérez Adventure',
        short_name: 'RatoncitoPérez',
        description: 'La aventura familiar con el Ratoncito Pérez en Madrid',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
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
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@features': resolve(__dirname, './src/features'),
      '@services': resolve(__dirname, './src/services'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './src/assets'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@styles': resolve(__dirname, './src/styles'),
      '@data': resolve(__dirname, './src/data')
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'mousie-adventure-frontend.onrender.com',
      'mousie-adventure-frontend.onrender.com' 
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    publicDir: 'public',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          map: ['leaflet', 'react-leaflet'],
          animation: ['framer-motion']
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'mousie-adventure-frontend.onrender.com',
      'mousie-adventure-frontend.onrender.com'
    ]
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
