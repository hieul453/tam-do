import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

/**
 * Mã commit của bản đang build, để hiện trên trang Kiểm tra hạ tầng.
 * Có dòng đó thì nhìn phát biết ngay trình duyệt đang chạy bản nào — chính là
 * thứ đã giúp phát hiện service worker phục vụ bundle cũ.
 *
 * Trên Vercel thì lấy từ biến môi trường; chạy local thì hỏi git.
 */
function layMaBuild(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'khong-ro'
  }
}

export default defineConfig({
  define: {
    __MA_BUILD__: JSON.stringify(layMaBuild()),
    __LUC_BUILD__: JSON.stringify(new Date().toISOString()),
  },
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
