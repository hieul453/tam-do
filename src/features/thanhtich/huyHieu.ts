import { cacNhanh } from '@/content'
import { khoaPhan, type SoLieuHoc } from '@/features/tiendo/duLieu'

/**
 * Huy hiệu.
 *
 * Suy ra từ số liệu chứ không lưu thành bảng riêng. Suy ra thì không bao giờ
 * lệch với thực tế; lưu thành dòng thì có ngày lệch, và lúc đó người học nhìn
 * thấy một huy hiệu mình chưa từng đạt.
 *
 * Cái giá: không biết "đạt lúc nào", nên chưa báo được khoảnh khắc vừa đạt.
 * Ghi ở backlog.
 *
 * Nguyên tắc chọn mốc: mỗi huy hiệu phải ứng với một việc học thật. Không có
 * huy hiệu cho "mở app 10 lần" — thứ đó đếm được nhưng không nói lên gì.
 */

export type HuyHieu = {
  ma: string
  ten: string
  /** Điều kiện, viết cho người đọc chứ không phải cho máy. */
  dieuKien: string
  /** Vì sao mốc này đáng ăn mừng. */
  yNghia: string
  dat: boolean
}

/** Bao nhiêu hướng tiếp cận thực sự có nội dung ở một phần. */
function tongHuongCua(phan: { nhanh?: unknown[]; daoSau?: unknown; apDung?: unknown }) {
  return [Boolean(phan.nhanh?.length), Boolean(phan.daoSau), Boolean(phan.apDung)].filter(Boolean)
    .length
}

/** Có phần nào đã xong hết mọi hướng của nó chưa. */
function coPhanTronVen(soLieu: SoLieuHoc) {
  for (const nhanh of cacNhanh) {
    for (const chuong of nhanh.chuong) {
      for (const phan of chuong.phan) {
        const tong = tongHuongCua(phan)
        if (tong === 0) continue
        const khoa = khoaPhan(nhanh.id, chuong.id, phan.id)
        const xong = soLieu.daXong.filter((x) => x.phanId === khoa).length
        if (xong >= tong) return true
      }
    }
  }
  return false
}

export function huyHieuCua(soLieu: SoLieuHoc): HuyHieu[] {
  const coHuong = (h: string) => soLieu.daXong.some((x) => x.huong === h)

  return [
    {
      ma: 'buoc-dau',
      ten: 'Bước đầu tiên',
      dieuKien: 'Xong một phiên học',
      yNghia: 'Bắt đầu là phần khó nhất của mọi việc học.',
      dat: soLieu.soPhien >= 1,
    },
    {
      ma: 'doc-toi-nguon',
      ten: 'Đọc tới nguồn',
      dieuKien: 'Đọc hết một bài Đào sâu',
      yNghia: 'Biết một điều khác với biết vì sao điều đó đúng.',
      dat: coHuong('dao-sau'),
    },
    {
      ma: 'dua-vao-doi-song',
      ten: 'Đưa vào đời sống',
      dieuKien: 'Xem hết một phần Áp dụng',
      yNghia: 'Kiến thức chỉ đổi được gì khi nó ra khỏi đầu.',
      dat: coHuong('ap-dung'),
    },
    {
      ma: 'tron-ven',
      ten: 'Trọn một phần',
      dieuKien: 'Xong cả ba hướng của cùng một phần',
      yNghia: 'Ba cách nhìn vào một nội dung — đó là cách nó ở lại.',
      dat: coPhanTronVen(soLieu),
    },
    {
      ma: 'ba-ngay',
      ten: 'Ba ngày liền',
      dieuKien: 'Chuỗi 3 ngày',
      yNghia: 'Ngày thứ ba là lúc thói quen bắt đầu có hình.',
      dat: soLieu.chuoiDaiNhat >= 3,
    },
    {
      ma: 'mot-tuan',
      ten: 'Một tuần liền',
      dieuKien: 'Chuỗi 7 ngày',
      yNghia: 'Đủ dài để vượt qua một tuần bận rộn mà không đứt.',
      dat: soLieu.chuoiDaiNhat >= 7,
    },
    {
      ma: 'tram-diem',
      ten: 'Trăm điểm',
      dieuKien: 'Tổng 100 XP',
      yNghia: 'Khoảng năm sáu phiên học — không còn là thử cho biết.',
      dat: soLieu.xpTong >= 100,
    },
    {
      ma: 'nguoi-on-bai',
      ten: 'Người ôn bài',
      dieuKien: 'Xong 10 phiên',
      yNghia: 'Quay lại ôn là thứ phân biệt người học với người đọc.',
      dat: soLieu.soPhien >= 10,
    },
  ]
}
