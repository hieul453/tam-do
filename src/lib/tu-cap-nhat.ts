/**
 * Tự tải lại trang khi service worker mới tiếp quản.
 *
 * Vì sao cần: app là PWA, service worker lưu sẵn index.html để chạy được khi
 * mất mạng. Sau mỗi lần deploy, lần mở đầu tiên vẫn nhận bản cũ từ cache;
 * phải tải lại lần thứ hai mới thấy bản mới. Đã gặp thật: merge xong, mở
 * tam-do-nu.vercel.app thì trang vẫn chạy bundle cũ.
 *
 * Với người soạn nội dung thì đây là cái bẫy khó chịu nhất — sửa bài, merge,
 * mở link, thấy y như cũ, tưởng mình làm sai.
 *
 * Cách xử lý: `registerType: 'autoUpdate'` đã bật skipWaiting + clientsClaim,
 * nên service worker mới tiếp quản ngay. Chỉ cần nghe sự kiện đó rồi tải lại
 * một lần. Không đụng vào cấu hình Workbox nên phần chạy offline giữ nguyên.
 */
export function batTuCapNhat() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  // Lần đầu cài service worker cũng bắn controllerchange, nhưng lúc đó trang
  // đang chạy đúng bản mới nhất rồi — tải lại chỉ tổ nhấp nháy.
  const daCoSWTuTruoc = Boolean(navigator.serviceWorker.controller)
  let dangTaiLai = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!daCoSWTuTruoc || dangTaiLai) return
    dangTaiLai = true
    window.location.reload()
  })
}
