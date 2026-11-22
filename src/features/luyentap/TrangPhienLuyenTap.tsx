import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useSoLieu, useGhiNhanLuyenTap } from '@/features/tiendo/duLieu'
import { PhienHoc, type KetQuaPhien } from '@/features/hoc/PhienHoc'
import { ManTongKet } from '@/features/hoc/ManTongKet'
import { cauDaHoc, tronVaChon } from './chonBaiOn'

/**
 * Một phiên luyện tập, chiếm trọn màn hình như phiên học.
 *
 * Tách thành route riêng chứ không mở ngay trong trang Luyện tập, vì khung
 * điều hướng chỉ biết ẩn mình theo đường dẫn. Thêm nữa: nút Back của trình
 * duyệt khi đó làm đúng việc người ta mong — ra khỏi phiên.
 */
export function TrangPhienLuyenTap() {
  const { soLieu, sanSang } = useSoLieu()
  const ghiNhan = useGhiNhanLuyenTap()

  const [lan, setLan] = useState(0)
  const [ketQua, setKetQua] = useState<KetQuaPhien | null>(null)

  // `lan` để bấm "Luyện phiên nữa" là trộn lại một bộ câu khác.
  const baiTap = useMemo(
    () => (sanSang ? tronVaChon(cauDaHoc(soLieu)) : []),
    [soLieu, sanSang, lan],
  )

  if (!sanSang) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <p className="text-sm text-chu-phu">Đang chọn câu để ôn…</p>
      </div>
    )
  }

  if (baiTap.length === 0) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="text-chu-phu">Chưa có câu nào để ôn.</p>
          <Link to="/luyen-tap" className="mt-3 inline-block font-bold text-nhan-dam underline">
            Về trang Luyện tập
          </Link>
        </div>
      </div>
    )
  }

  if (ketQua) {
    return (
      <ManTongKet
        tongCau={ketQua.tongCau}
        soSai={ketQua.soSai}
        timConLai={ketQua.timConLai}
        xp={ketQua.xp}
        tenPhan="Trộn từ những phần bạn đã học"
        tieuDe="Xong phiên ôn"
        dangLuu={ghiNhan.isPending}
        luuThatBai={ghiNhan.isError}
        nhanChinh="Luyện phiên nữa"
        bamChinh={() => {
          setKetQua(null)
          setLan((n) => n + 1)
        }}
      />
    )
  }

  return (
    <PhienHoc
      // key: đổi lượt là dựng lại phiên từ đầu, không mang theo trạng thái cũ.
      key={lan}
      baiTap={baiTap}
      duongDanThoat="/luyen-tap"
      khiXong={(kq) => {
        ghiNhan.mutate({ xp: kq.xp, timConLai: kq.timConLai })
        setKetQua(kq)
      }}
    />
  )
}
