import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',  
      manifest: {
        "name":"Admin Beri Rezeki",
        "short_name":"Admin Beri Rezeki",
        "theme_color":"#EC615B",
        "icons":[
          {"src":"./img/icons/android-chrome-192x192.png", "sizes":"192x192","type":"image/png"},
          {"src":"./img/icons/android-chrome-512x512.png", "sizes":"512x512", "type":"image/png"},
          // {"src":"./img/icons/android-chrome-maskable-192x192.png", "sizes":"192x192", "type":"image/png", "purpose":"maskable"},
          // {"src":"./img/icons/android-chrome-maskable-512x512.png", "sizes":"512x512", "type":"image/png", "purpose":"maskable"}
        ],
        "start_url":".",
        "display":"standalone",
        "background_color":"#FFFFFF"
      },
      workbox: {
        // workbox options for generateSW
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src") // map '@' to './src' 
    },
  }
})
