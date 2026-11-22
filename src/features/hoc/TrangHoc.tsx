import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { timPhan } from '@/content'
import { useGhiNhanPhien, khoaPhan } from '@/features/tiendo/duLieu'
import { PhienHoc, type KetQuaPhien } from './PhienHoc'
import { ManTongKet } from './ManTongKet'

/**
 * Phiên học NHANH của một phần.
 *
 * Cách chơi nằm ở `PhienHoc` — màn này chỉ lo hai việc riêng của nó: lấy bài
 * tập của phần nào, và ghi kết quả vào đúng phần đó.
 */
export function TrangHoc() {
  const { idNhanh = '', idChuong = '', idPhan = '' } = useParams()
  const kq = timPhan(idNhanh, idChuong, idPhan)
  const ghiNhan = useGhiNhanPhien()
  const [ketQua, setKetQua] = useState<KetQuaPhien | null>(null)

  const baiTap = kq?.phan.nhanh ?? []

  if (!kq || baiTap.length === 0) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="text-chu-phu">Phần này chưa có bài tập.</p>
          <Link to="/" className="mt-3 inline-block font-bold text-nhan-dam underline">
            Về lộ trình
          </Link>
        </div>
      </div>
    )
  }

  const duongDanPhan = `/phan/${idNhanh}/${idChuong}/${idPhan}`

  if (ketQua) {
    return (
      <ManTongKet
        tongCau={ketQua.tongCau}
        soSai={ketQua.soSai}
        timConLai={ketQua.timConLai}
        xp={ketQua.xp}
        tenPhan={kq.phan.tieuDe}
        dangLuu={ghiNhan.isPending}
        luuThatBai={ghiNhan.isError}
        duongDanChinh={duongDanPhan}
        nhanChinh="Học sâu hơn phần này"
      />
    )
  }

  return (
    <PhienHoc
      baiTap={baiTap}
      duongDanThoat="/"
      khiXong={(kq2) => {
        // Ghi thất bại thì vẫn cho sang màn tổng kết. Mất XP một phiên là
        // chuyện nhỏ; giữ người học lại giữa lúc vừa làm xong là chuyện lớn.
        ghiNhan.mutate({
          phanId: khoaPhan(idNhanh, idChuong, idPhan),
          huong: 'nhanh',
          xp: kq2.xp,
          timConLai: kq2.timConLai,
        })
        setKetQua(kq2)
      }}
    />
  )
}
