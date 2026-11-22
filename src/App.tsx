import { Routes, Route, Navigate } from 'react-router'
import { Khung } from '@/components/layout/Khung'
import { TrangLoTrinh } from '@/features/lotrinh/TrangLoTrinh'
import { TrangPhan } from '@/features/phan/TrangPhan'
import { TrangLuyenTap, TrangThanhTich, TrangToi } from '@/features/khac/TrangSapCo'

/**
 * M1 dựng khung điều hướng và lộ trình.
 * `/hoc/...` (phiên học, chiếm trọn màn hình) sẽ gắn vào ở M2.
 */
export default function App() {
  return (
    <Khung>
      <Routes>
        <Route path="/" element={<TrangLoTrinh />} />
        <Route path="/phan/:idNhanh/:idChuong/:idPhan" element={<TrangPhan />} />
        <Route path="/luyen-tap" element={<TrangLuyenTap />} />
        <Route path="/thanh-tich" element={<TrangThanhTich />} />
        <Route path="/toi" element={<TrangToi />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Khung>
  )
}
