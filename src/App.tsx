import { Routes, Route, Navigate } from 'react-router'
import { KiemTraHaTang } from '@/pages/KiemTraHaTang'

/**
 * Giai đoạn hiện tại: chỉ có hạ tầng, chưa có tính năng.
 * Trang duy nhất là màn kiểm tra hạ tầng — xác nhận stack đã chạy đúng.
 *
 * 5 tab (Hôm nay / Hành trình / Sổ tay / Áp dụng / Tôi) sẽ thêm vào đây
 * khi bắt đầu làm tính năng.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<KiemTraHaTang />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
