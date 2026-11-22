import { describe, expect, it } from 'vitest'
import { khoaPhan, type SoLieuHoc } from '@/features/tiendo/duLieu'
import { timPhan } from '@/content'
import { cauDaHoc, tronVaChon, SO_CAU_LUYEN_TAP } from './chonBaiOn'

/**
 * Luật quan trọng nhất của trang Luyện tập: chỉ ôn thứ ĐÃ học.
 *
 * Lấy cả phần chưa mở ra bao giờ thì người ta sai hết, mà sai vì chưa được dạy
 * thì không dạy được gì — nên hai bài đầu canh đúng chỗ đó.
 */

const PHAN_1 = { nhanh: 'nhan-thuc', chuong: 'tri-nho', phan: 'ba-buoc' }
const PHAN_2 = { nhanh: 'nhan-thuc', chuong: 'tri-nho', phan: 'quen' }

const khoa1 = khoaPhan(PHAN_1.nhanh, PHAN_1.chuong, PHAN_1.phan)
const khoa2 = khoaPhan(PHAN_2.nhanh, PHAN_2.chuong, PHAN_2.phan)

const soLieu = (daXong: SoLieuHoc['daXong']): SoLieuHoc => ({
  chuoi: 1,
  chuoiDaiNhat: 1,
  tim: 5,
  xpHomNay: 0,
  xpTong: 0,
  mucTieuXpNgay: 20,
  daHocHomNay: true,
  daXong,
})

describe('cauDaHoc', () => {
  it('chưa học gì thì không có gì để ôn', () => {
    expect(cauDaHoc(soLieu([]))).toHaveLength(0)
  })

  it('chỉ lấy câu của phần đã xong hướng Nhanh', () => {
    const cac = cauDaHoc(soLieu([{ phanId: khoa1, huong: 'nhanh', xp: 19, soLan: 1 }]))
    const goc = timPhan(PHAN_1.nhanh, PHAN_1.chuong, PHAN_1.phan)?.phan.nhanh ?? []
    expect(goc.length).toBeGreaterThan(0)
    expect(cac).toHaveLength(goc.length)
    expect(cac.every((c) => goc.some((b) => b.id === c.bt.id))).toBe(true)
  })

  it('đọc xong Đào sâu không làm phần đó thành thứ để ôn', () => {
    // Bài đọc không có câu hỏi nào, nên không đóng góp gì cho phiên ôn.
    expect(cauDaHoc(soLieu([{ phanId: khoa1, huong: 'dao-sau', xp: 15, soLan: 1 }]))).toHaveLength(
      0,
    )
  })

  it('học nhiều phần thì gom câu của tất cả', () => {
    const mot = cauDaHoc(soLieu([{ phanId: khoa1, huong: 'nhanh', xp: 19, soLan: 1 }]))
    const hai = cauDaHoc(
      soLieu([
        { phanId: khoa1, huong: 'nhanh', xp: 19, soLan: 1 },
        { phanId: khoa2, huong: 'nhanh', xp: 17, soLan: 1 },
      ]),
    )
    expect(hai.length).toBeGreaterThan(mot.length)
  })
})

describe('tronVaChon', () => {
  const kho = cauDaHoc(
    soLieu([
      { phanId: khoa1, huong: 'nhanh', xp: 19, soLan: 1 },
      { phanId: khoa2, huong: 'nhanh', xp: 17, soLan: 1 },
    ]),
  )

  it('không lấy quá số câu của một phiên', () => {
    expect(tronVaChon(kho).length).toBeLessThanOrEqual(SO_CAU_LUYEN_TAP)
  })

  it('kho ít hơn một phiên thì lấy hết, không lặp lại câu nào', () => {
    const it2 = kho.slice(0, 3)
    const ra = tronVaChon(it2)
    expect(ra).toHaveLength(3)
    expect(new Set(ra.map((b) => b.id)).size).toBe(3)
  })

  it('chỉ trả về câu có trong kho, và không trùng nhau', () => {
    const ra = tronVaChon(kho)
    expect(new Set(ra.map((b) => b.id)).size).toBe(ra.length)
    expect(ra.every((b) => kho.some((c) => c.bt.id === b.id))).toBe(true)
  })

  it('không làm hỏng kho gốc', () => {
    const truoc = kho.map((c) => c.bt.id).join(',')
    tronVaChon(kho)
    expect(kho.map((c) => c.bt.id).join(',')).toBe(truoc)
  })
})
