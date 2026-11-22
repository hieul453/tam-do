import { describe, expect, it } from 'vitest'
import { khoaPhan, type SoLieuHoc } from '@/features/tiendo/duLieu'
import { huyHieuCua } from './huyHieu'

/**
 * Huy hiệu suy ra từ số liệu, nên bài kiểm ở đây canh đúng một thứ: không huy
 * hiệu nào bật sớm hơn điều kiện của nó. Hiện một huy hiệu người ta chưa đạt
 * làm hỏng cả ý nghĩa của những cái còn lại.
 */

const KHOA = khoaPhan('nhan-thuc', 'tri-nho', 'ba-buoc')

const nen = (sua: Partial<SoLieuHoc> = {}): SoLieuHoc => ({
  chuoi: 0,
  chuoiDaiNhat: 0,
  tim: 5,
  xpHomNay: 0,
  xpTong: 0,
  mucTieuXpNgay: 20,
  daHocHomNay: false,
  soPhien: 0,
  soNgayHoc: 0,
  daXong: [],
  ...sua,
})

const dat = (sl: SoLieuHoc) =>
  huyHieuCua(sl)
    .filter((h) => h.dat)
    .map((h) => h.ma)

describe('huyHieuCua', () => {
  it('người chưa học gì thì chưa đạt huy hiệu nào', () => {
    expect(dat(nen())).toEqual([])
  })

  it('mọi huy hiệu đều có mã riêng và đủ chữ cho người đọc', () => {
    const cac = huyHieuCua(nen())
    expect(new Set(cac.map((h) => h.ma)).size).toBe(cac.length)
    for (const h of cac) {
      expect(h.ten.length, h.ma).toBeGreaterThan(0)
      expect(h.dieuKien.length, h.ma).toBeGreaterThan(0)
      expect(h.yNghia.length, h.ma).toBeGreaterThan(0)
    }
  })

  it('xong phiên đầu tiên mở đúng một huy hiệu', () => {
    expect(dat(nen({ soPhien: 1 }))).toEqual(['buoc-dau'])
  })

  it('đọc Đào sâu và xem Áp dụng mở đúng hai huy hiệu tương ứng', () => {
    const sl = nen({
      soPhien: 2,
      daXong: [
        { phanId: KHOA, huong: 'dao-sau', xp: 15, soLan: 1 },
        { phanId: KHOA, huong: 'ap-dung', xp: 10, soLan: 1 },
      ],
    })
    expect(dat(sl)).toContain('doc-toi-nguon')
    expect(dat(sl)).toContain('dua-vao-doi-song')
    // Mới hai trên ba hướng, chưa trọn vẹn.
    expect(dat(sl)).not.toContain('tron-ven')
  })

  it('đủ cả ba hướng của một phần mới được "Trọn một phần"', () => {
    const sl = nen({
      soPhien: 3,
      daXong: [
        { phanId: KHOA, huong: 'nhanh', xp: 19, soLan: 1 },
        { phanId: KHOA, huong: 'dao-sau', xp: 15, soLan: 1 },
        { phanId: KHOA, huong: 'ap-dung', xp: 10, soLan: 1 },
      ],
    })
    expect(dat(sl)).toContain('tron-ven')
  })

  it('ba hướng rải ở hai phần khác nhau thì chưa trọn phần nào', () => {
    const khac = khoaPhan('nhan-thuc', 'tri-nho', 'quen')
    const sl = nen({
      soPhien: 3,
      daXong: [
        { phanId: KHOA, huong: 'nhanh', xp: 19, soLan: 1 },
        { phanId: KHOA, huong: 'dao-sau', xp: 15, soLan: 1 },
        { phanId: khac, huong: 'ap-dung', xp: 10, soLan: 1 },
      ],
    })
    expect(dat(sl)).not.toContain('tron-ven')
  })

  it('chuỗi tính theo chuỗi DÀI NHẤT, không phải chuỗi hiện tại', () => {
    // Đứt chuỗi rồi thì chuoi về 0, nhưng huy hiệu đã đạt không bị lấy lại.
    expect(dat(nen({ chuoi: 0, chuoiDaiNhat: 7 }))).toEqual(
      expect.arrayContaining(['ba-ngay', 'mot-tuan']),
    )
  })

  it('các mốc số không bật sớm một đơn vị', () => {
    expect(dat(nen({ chuoiDaiNhat: 2 }))).not.toContain('ba-ngay')
    expect(dat(nen({ chuoiDaiNhat: 3 }))).toContain('ba-ngay')
    expect(dat(nen({ chuoiDaiNhat: 6 }))).not.toContain('mot-tuan')
    expect(dat(nen({ chuoiDaiNhat: 7 }))).toContain('mot-tuan')
    expect(dat(nen({ xpTong: 99 }))).not.toContain('tram-diem')
    expect(dat(nen({ xpTong: 100 }))).toContain('tram-diem')
    expect(dat(nen({ soPhien: 9 }))).not.toContain('nguoi-on-bai')
    expect(dat(nen({ soPhien: 10 }))).toContain('nguoi-on-bai')
  })
})
