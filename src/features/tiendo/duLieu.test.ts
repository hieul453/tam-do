import { describe, expect, it } from 'vitest'
import {
  xpPhienNhanh,
  khoaPhan,
  daXongHuong,
  soHuongDaXong,
  MUC_TIEU,
  TIM_TOI_DA,
  XP_DAO_SAU,
  XP_AP_DUNG,
  type SoLieuHoc,
} from './duLieu'

/**
 * Logic tiến độ chia làm hai nửa: nửa trong SQL (chuỗi ngày, tim, cộng dồn XP)
 * được kiểm bằng `.git/sb-07-test-rls-m3.mjs` đánh thẳng vào database thật;
 * nửa thuần TypeScript được kiểm ở đây.
 *
 * Bài kiểm cuối cùng là bài quan trọng nhất: nó canh cho hằng số ở client
 * không trôi khỏi ràng buộc ở database. Lệch nhau thì người dùng bấm vào và
 * nhận lỗi mà không hiểu vì sao.
 */

const soLieuMau = (daXong: SoLieuHoc['daXong']): SoLieuHoc => ({
  chuoi: 3,
  chuoiDaiNhat: 7,
  tim: 4,
  xpHomNay: 12,
  xpTong: 120,
  mucTieuXpNgay: 20,
  daHocHomNay: true,
  daXong,
})

describe('xpPhienNhanh', () => {
  it('mỗi câu 2 XP', () => {
    expect(xpPhienNhanh(6, 1)).toBe(12)
    expect(xpPhienNhanh(10, 3)).toBe(20)
  })

  it('không sai câu nào thì thưởng thêm 5', () => {
    expect(xpPhienNhanh(6, 0)).toBe(17)
    expect(xpPhienNhanh(0, 0)).toBe(5)
  })

  it('không bao giờ vượt trần 500 mà database chặn', () => {
    // 200 câu là xa hơn mọi phần hiện có, vẫn phải nằm trong trần.
    expect(xpPhienNhanh(200, 0)).toBeLessThanOrEqual(500)
  })
})

describe('khoaPhan', () => {
  it('ghép cả ba cấp, không chỉ id phần', () => {
    expect(khoaPhan('nhan-thuc', 'tri-nho', 'quen')).toBe('nhan-thuc/tri-nho/quen')
  })

  it('hai chương khác nhau có phần cùng id thì khoá vẫn khác nhau', () => {
    expect(khoaPhan('nhan-thuc', 'tri-nho', 'quen')).not.toBe(
      khoaPhan('nhan-thuc', 'chu-y', 'quen'),
    )
  })
})

describe('đọc tiến độ của một phần', () => {
  const khoa = khoaPhan('nhan-thuc', 'tri-nho', 'ba-buoc')
  const sl = soLieuMau([
    { phanId: khoa, huong: 'nhanh', xp: 17, soLan: 2 },
    { phanId: khoa, huong: 'dao-sau', xp: XP_DAO_SAU, soLan: 1 },
    { phanId: khoaPhan('nhan-thuc', 'tri-nho', 'quen'), huong: 'nhanh', xp: 12, soLan: 1 },
  ])

  it('biết hướng nào đã xong', () => {
    expect(daXongHuong(sl, khoa, 'nhanh')).toBe(true)
    expect(daXongHuong(sl, khoa, 'dao-sau')).toBe(true)
    expect(daXongHuong(sl, khoa, 'ap-dung')).toBe(false)
  })

  it('đếm đúng số hướng của riêng phần đó, không lẫn phần khác', () => {
    expect(soHuongDaXong(sl, khoa)).toBe(2)
    expect(soHuongDaXong(sl, khoaPhan('nhan-thuc', 'tri-nho', 'quen'))).toBe(1)
    expect(soHuongDaXong(sl, khoaPhan('nhan-thuc', 'tri-nho', 'nho-sai'))).toBe(0)
  })
})

describe('hằng số phải khớp ràng buộc ở database', () => {
  it('mục tiêu ngày đúng bộ giá trị hàm dat_muc_tieu_ngay nhận', () => {
    // SQL: if p_xp not in (10, 20, 30, 50) then raise
    expect([...MUC_TIEU]).toEqual([10, 20, 30, 50])
  })

  it('tim tối đa đúng trần của cột profiles.tim', () => {
    // SQL: check (tim between 0 and 5)
    expect(TIM_TOI_DA).toBe(5)
  })

  it('XP của hướng đọc nằm trong trần 500 của một phiên', () => {
    expect(XP_DAO_SAU).toBeGreaterThan(0)
    expect(XP_AP_DUNG).toBeGreaterThan(0)
    expect(Math.max(XP_DAO_SAU, XP_AP_DUNG)).toBeLessThanOrEqual(500)
  })
})
