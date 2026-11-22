import { Routes, Route, Navigate } from 'react-router'
import { Khung } from '@/components/layout/Khung'
import { TrangLoTrinh } from '@/features/lotrinh/TrangLoTrinh'
import { TrangPhan } from '@/features/phan/TrangPhan'
import { TrangLuyenTap, TrangThanhTich, TrangToi } from '@/features/khac/TrangSapCo'
import { TrangHoc } from '@/features/hoc/TrangHoc'
import { TrangDaoSau } from '@/features/hoc/TrangDaoSau'
import { TrangApDung } from '@/features/hoc/TrangApDung'

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
        <Route path="/hoc/:idNhanh/:idChuong/:idPhan/nhanh" element={<TrangHoc />} />
        <Route path="/hoc/:idNhanh/:idChuong/:idPhan/dao-sau" element={<TrangDaoSau />} />
        <Route path="/hoc/:idNhanh/:idChuong/:idPhan/ap-dung" element={<TrangApDung />} />
        <Route path="/luyen-tap" element={<TrangLuyenTap />} />
        <Route path="/thanh-tich" element={<TrangThanhTich />} />
        <Route path="/toi" element={<TrangToi />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Khung>
  )
}
