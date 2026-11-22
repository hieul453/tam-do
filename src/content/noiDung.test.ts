import { describe, expect, it } from 'vitest'
import { Nhanh as NhanhSchema } from './schema'
import { cacNhanh, timPhan } from './index'

/**
 * Nội dung nằm trong file `.ts` chứ không trong database, nên sai cấu trúc chỉ
 * hiện ra lúc chạy. Những kiểm tra dưới đây là cái lưới: sửa nội dung mà làm
 * vỡ cấu trúc thì CI đỏ trước khi lên bản live.
 *
 * Quan trọng nhất là hai cái cuối — chúng canh luật "số liệu nghiên cứu phải
 * có nguồn mở được" trong CLAUDE.md. Luật mà không có ai canh thì sớm muộn
 * cũng bị phá.
 */

const phanMo = cacNhanh
  .flatMap((n) => n.chuong.map((c) => ({ n, c })))
  .flatMap(({ n, c }) => c.phan.map((p) => ({ n, c, p })))
  .filter(({ p }) => p.trangThai === 'mo')

describe('cấu trúc nội dung', () => {
  it('mọi nhánh đều đúng schema', () => {
    for (const n of cacNhanh) {
      const kq = NhanhSchema.safeParse(n)
      expect(kq.success, `nhánh "${n.id}": ${JSON.stringify(kq.error?.issues)}`).toBe(true)
    }
  })

  it('id không trùng nhau trong cùng một cấp', () => {
    const idNhanh = cacNhanh.map((n) => n.id)
    expect(new Set(idNhanh).size).toBe(idNhanh.length)

    for (const n of cacNhanh) {
      const idChuong = n.chuong.map((c) => c.id)
      expect(new Set(idChuong).size, `chương trùng id trong nhánh ${n.id}`).toBe(idChuong.length)

      for (const c of n.chuong) {
        const idPhan = c.phan.map((p) => p.id)
        expect(new Set(idPhan).size, `phần trùng id trong chương ${c.id}`).toBe(idPhan.length)
      }
    }
  })

  it('timPhan tìm được mọi phần đang mở', () => {
    for (const { n, c, p } of phanMo) {
      expect(timPhan(n.id, c.id, p.id)?.phan.id, `${n.id}/${c.id}/${p.id}`).toBe(p.id)
    }
  })

  it('nhánh sắp có thì không có chương, nhánh mở thì phải có', () => {
    for (const n of cacNhanh) {
      if (n.trangThai === 'mo') expect(n.chuong.length, n.id).toBeGreaterThan(0)
      else expect(n.chuong.length, n.id).toBe(0)
    }
  })
})

describe('phạm vi bản pilot', () => {
  it('đúng một nhánh được mở', () => {
    expect(cacNhanh.filter((n) => n.trangThai === 'mo')).toHaveLength(1)
  })

  it('mỗi phần đang mở có ít nhất một hướng tiếp cận dùng được', () => {
    for (const { p } of phanMo) {
      const co = [Boolean(p.nhanh?.length), Boolean(p.daoSau), Boolean(p.apDung)].filter(Boolean)
      expect(co.length, `phần "${p.id}" mở mà không có hướng nào`).toBeGreaterThan(0)
    }
  })
})

describe('luật nguồn', () => {
  it('mọi bài Đào sâu đều dẫn nguồn', () => {
    for (const { p } of phanMo) {
      if (!p.daoSau) continue
      expect(p.daoSau.nguon.length, `phần "${p.id}" không có nguồn`).toBeGreaterThan(0)
      for (const ng of p.daoSau.nguon) {
        expect(ng.moTa.trim().length, `nguồn "${ng.tenNgan}" thiếu mô tả`).toBeGreaterThan(0)
      }
    }
  })

  it('mọi khối nghiên cứu đều ghi rõ nguồn', () => {
    for (const { p } of phanMo) {
      for (const k of p.daoSau?.khoi ?? []) {
        if (k.loai !== 'nghienCuu') continue
        expect(k.nguon?.trim().length ?? 0, `khối "${k.tieuDe}" trong "${p.id}" thiếu nguồn`).toBeGreaterThan(0)
      }
    }
  })
})
