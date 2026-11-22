import { cacNhanh } from '@/content'
import type { BaiTap } from '@/content/schema'
import { khoaPhan, daXongHuong, type SoLieuHoc } from '@/features/tiendo/duLieu'

/** Số câu của một phiên luyện tập. Đủ ngắn để làm trong giờ nghỉ. */
export const SO_CAU_LUYEN_TAP = 8

type CauOn = { bt: BaiTap; tenPhan: string }

/**
 * Gom câu hỏi của những phần người học ĐÃ làm xong hướng Nhanh.
 *
 * Chỉ lấy phần đã học, không lấy phần chưa mở ra bao giờ: luyện tập là ôn lại,
 * không phải kiểm tra bất ngờ. Phần chưa học thì người ta sai hết, và sai vì
 * chưa được dạy thì không dạy được gì cả.
 */
export function cauDaHoc(soLieu: SoLieuHoc): CauOn[] {
  const ra: CauOn[] = []
  for (const nhanh of cacNhanh) {
    for (const chuong of nhanh.chuong) {
      for (const phan of chuong.phan) {
        if (!phan.nhanh?.length) continue
        if (!daXongHuong(soLieu, khoaPhan(nhanh.id, chuong.id, phan.id), 'nhanh')) continue
        for (const bt of phan.nhanh) ra.push({ bt, tenPhan: phan.tieuDe })
      }
    }
  }
  return ra
}

/**
 * Chọn ngẫu nhiên một phiên ôn.
 *
 * Ngẫu nhiên thật, không theo thứ tự: mỗi lần vào là một phiên khác, nếu không
 * thì lần thứ hai người ta chỉ nhớ thứ tự chứ không nhớ nội dung.
 *
 * Chưa phải ôn giãn cách — để làm đúng phải lưu từng câu trả lời sai, và đó là
 * việc của bản sau. Màn hình nói thẳng điều này chứ không giả vờ thông minh.
 */
export function tronVaChon(cac: CauOn[], soCau = SO_CAU_LUYEN_TAP): BaiTap[] {
  const ban = [...cac]
  for (let i = ban.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ban[i], ban[j]] = [ban[j], ban[i]]
  }
  return ban.slice(0, soCau).map((x) => x.bt)
}
