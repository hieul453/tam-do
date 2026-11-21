import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tâm Đồ',
        short_name: 'Tâm Đồ',
        description: 'Bản đồ tâm lý học của riêng bạn',
        lang: 'vi',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFF6F1',
        theme_color: '#F2788A',
        // Tạm dùng SVG cho mọi cỡ. Khi có logo chính thức thì xuất thêm
        // icon-192.png / icon-512.png / apple-touch-icon.png (iOS cần PNG).
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Cho phép mở từ điện thoại trong cùng wifi: npm run dev -- --host
    port: 5173,
  },
})
