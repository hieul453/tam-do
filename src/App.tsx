import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Khung } from '@/components/layout/Khung'
import { TrangLoTrinh } from '@/features/lotrinh/TrangLoTrinh'
import { KHOA_DA_CHAO } from '@/features/chao/khoa'
import { docCo } from '@/lib/kho-cuc-bo'

/**
 * Hai route chiếm trọn màn hình — `/hoc/…` và `/luyen-tap/phien` — được
 * `Khung` nhận ra theo đường dẫn rồi tự ẩn thanh điều hướng đi, để không có gì
 * kéo người học ra khỏi bài.
 *
 * Chỉ lộ trình được nạp thẳng; mọi màn còn lại tách thành gói riêng. Lộ trình
 * là thứ ai cũng thấy đầu tiên, còn bài đọc dài hay bộ chơi hỏi đáp thì chỉ
 * tải khi thật sự mở tới — đáng giá với người xem bằng 4G.
 */
// Viết đủ từng dòng thay vì gói vào một hàm trợ giúp: hàm trợ giúp làm mất
// kiểu của props, mà mất kiểu thì TypeScript hết canh giúp chỗ gọi.
const ManChao = lazy(() => import('@/features/chao/ManChao').then((m) => ({ default: m.ManChao })))
const TrangPhan = lazy(() =>
  import('@/features/phan/TrangPhan').then((m) => ({ default: m.TrangPhan })),
)
const TrangHoc = lazy(() =>
  import('@/features/hoc/TrangHoc').then((m) => ({ default: m.TrangHoc })),
)
const TrangDaoSau = lazy(() =>
  import('@/features/hoc/TrangDaoSau').then((m) => ({ default: m.TrangDaoSau })),
)
const TrangApDung = lazy(() =>
  import('@/features/hoc/TrangApDung').then((m) => ({ default: m.TrangApDung })),
)
const TrangLuyenTap = lazy(() =>
  import('@/features/luyentap/TrangLuyenTap').then((m) => ({ default: m.TrangLuyenTap })),
)
const TrangPhienLuyenTap = lazy(() =>
  import('@/features/luyentap/TrangPhienLuyenTap').then((m) => ({ default: m.TrangPhienLuyenTap })),
)
const TrangThanhTich = lazy(() =>
  import('@/features/thanhtich/TrangThanhTich').then((m) => ({ default: m.TrangThanhTich })),
)
const TrangToi = lazy(() =>
  import('@/features/toi/TrangToi').then((m) => ({ default: m.TrangToi })),
)

/** Khoảng trống lúc gói của màn kia đang về. Cố tình nhạt: nó chỉ chớp một nhịp. */
function DangTai() {
  return (
    <div className="grid min-h-[50dvh] place-items-center" role="status" aria-live="polite">
      <span className="text-sm text-chu-mo">Đang mở…</span>
    </div>
  )
}

export default function App() {
  // Đọc một lần lúc dựng, không nghe thay đổi: cờ này chỉ đổi do chính màn
  // chào ở ngay dưới đây.
  const [daChao, setDaChao] = useState(() => docCo(KHOA_DA_CHAO))

  if (!daChao) {
    return (
      <Suspense fallback={<DangTai />}>
        <ManChao xong={() => setDaChao(true)} />
      </Suspense>
    )
  }

  return (
    <Khung>
      <Suspense fallback={<DangTai />}>
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
      </Suspense>
    </Khung>
  )
}
