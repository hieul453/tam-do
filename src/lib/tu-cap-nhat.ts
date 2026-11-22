/**
 * Tự tải lại khi service worker mới tiếp quản.
 *
 * Không có cái này thì sau mỗi lần deploy, lần mở đầu tiên vẫn nhận bundle cũ
 * từ cache — sửa xong, merge, mở link, thấy y như cũ, tưởng mình làm sai.
 * Đã gặp thật nên giữ lại.
 */
export function batTuCapNhat() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  // Lần đầu cài cũng bắn controllerchange, nhưng lúc đó đang chạy bản mới rồi.
  const daCoSWTuTruoc = Boolean(navigator.serviceWorker.controller)
  let dangTaiLai = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!daCoSWTuTruoc || dangTaiLai) return
    dangTaiLai = true
    window.location.reload()
  })
}
