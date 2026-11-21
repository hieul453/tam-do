/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/** Mã commit của bản đang chạy. Vite thay thế lúc build (xem vite.config.ts). */
declare const __MA_BUILD__: string

/** Thời điểm build, dạng ISO. */
declare const __LUC_BUILD__: string
