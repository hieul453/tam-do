import { Routes, Route, Navigate } from 'react-router'
import { KiemTraHaTang } from '@/pages/KiemTraHaTang'
import { XemNoiDung } from '@/pages/XemNoiDung'

/**
 * Giai đoạn hiện tại: hạ tầng và công cụ, chưa có giao diện thật.
 *
 *   /          Kiểm tra hạ tầng — stack còn chạy đúng không
 *   /noi-dung  Xem trước nội dung — markdown đã được đọc đúng chưa
 *
 * 5 tab thật (Hôm nay / Hành trình / Sổ tay / Áp dụng / Tôi) thêm vào đây
 * khi bắt đầu làm tính năng, theo bản thiết kế đã duyệt.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<KiemTraHaTang />} />
      <Route path="/noi-dung" element={<XemNoiDung />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
