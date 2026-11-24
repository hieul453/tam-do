import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

/**
 * Mã commit của bản đang build.
 *
 * Giữ lại từ vòng trước vì nó đã cứu một lần: hiện mã này ở đâu đó trong app
 * thì nhìn phát biết trình duyệt đang chạy bản nào. Chính là thứ đã lộ ra
 * chuyện service worker phục vụ bundle cũ sau khi deploy — không có nó thì
 * chỉ thấy "sửa rồi mà không thấy đổi" và đoán mò.
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
        name: 'Dự án mới',
        short_name: 'Dự án mới',
        lang: 'vi',
        start_url: '/',
        display: 'standalone',
        // Khớp với nền thật của app; lệch thì màn khởi động chớp một nhịp.
        background_color: '#ffffff',
        theme_color: '#ffffff',
        // iOS KHÔNG nhận SVG cho "thêm vào màn hình chính". Khi có logo chính
        // thức thì xuất thêm PNG 192 và 512 — xem docs/BAI-HOC.md.
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  resolve: {
    // fileURLToPath chứ không phải new URL(...).pathname: trên Windows cái sau
    // trả về '/D:/...' và mọi import '@/...' hỏng hết.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Mở được từ điện thoại trong cùng wifi: npm run dev:dienthoai
    port: 5173,
  },
})
