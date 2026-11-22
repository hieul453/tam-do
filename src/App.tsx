import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Khung } from '@/components/layout/Khung'
import { ManChao, KHOA_DA_CHAO } from '@/features/chao/ManChao'
import { docCo } from '@/lib/kho-cuc-bo'
import { TrangLoTrinh } from '@/features/lotrinh/TrangLoTrinh'
import { TrangPhan } from '@/features/phan/TrangPhan'
import { TrangThanhTich, TrangToi } from '@/features/khac/TrangSapCo'
import { TrangLuyenTap } from '@/features/luyentap/TrangLuyenTap'
import { TrangPhienLuyenTap } from '@/features/luyentap/TrangPhienLuyenTap'
import { TrangHoc } from '@/features/hoc/TrangHoc'
import { TrangDaoSau } from '@/features/hoc/TrangDaoSau'
import { TrangApDung } from '@/features/hoc/TrangApDung'

/**
 * Hai route chiếm trọn màn hình — `/hoc/…` và `/luyen-tap/phien` — được
 * `Khung` nhận ra theo đường dẫn rồi tự ẩn thanh điều hướng đi, để không có gì
 * kéo người học ra khỏi bài.
 */
export default function App() {
  // Đọc một lần lúc dựng, không nghe thay đổi: cờ này chỉ đổi do chính màn
  // chào ở ngay dưới đây.
  const [daChao, setDaChao] = useState(() => docCo(KHOA_DA_CHAO))

  if (!daChao) return <ManChao xong={() => setDaChao(true)} />

  return (
    <Khung>
      <Routes>
        <Route path="/" element={<TrangLoTrinh />} />
        <Route path="/phan/:idNhanh/:idChuong/:idPhan" element={<TrangPhan />} />
        <Route path="/hoc/:idNhanh/:idChuong/:idPhan/nhanh" element={<TrangHoc />} />
        <Route path="/hoc/:idNhanh/:idChuong/:idPhan/dao-sau" element={<TrangDaoSau />} />
        <Route path="/hoc/:idNhanh/:idChuong/:idPhan/ap-dung" element={<TrangApDung />} />
        <Route path="/luyen-tap" element={<TrangLuyenTap />} />
        <Route path="/luyen-tap/phien" element={<TrangPhienLuyenTap />} />
        <Route path="/thanh-tich" element={<TrangThanhTich />} />
        <Route path="/toi" element={<TrangToi />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Khung>
  )
}
