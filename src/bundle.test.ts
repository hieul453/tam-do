/**
 * Canh những cách import đã từng làm bundle phình.
 *
 * Mỗi mục ở đây đều có một lần vấp thật đứng sau, chép trong docs/BAI-HOC.md.
 * Bài kiểm này rẻ và chạy trong CI, nên nó bắt được trước khi ai đó phải đi
 * dò lại bundle lần nữa.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const GOC = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

function moiTepNguon(thuMuc: string): string[] {
  const ra: string[] = []
  for (const ten of readdirSync(thuMuc)) {
    const duong = join(thuMuc, ten)
    if (statSync(duong).isDirectory()) {
      ra.push(...moiTepNguon(duong))
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(ten) && !/\.test\./.test(ten)) {
      ra.push(duong)
    }
  }
  return ra
}

const TEP = moiTepNguon(GOC)

describe('cách import không được dùng', () => {
  it('có tìm thấy tệp nguồn để soi', () => {
    expect(TEP.length).toBeGreaterThan(0)
  })

  /**
   * Một dòng `import * as Icons from 'lucide-react'` từng kéo cả ~1500 icon
   * vào bundle: 399 kB gzip, bỏ đi còn 189 kB. Bundler không đoán được tên
   * nào sẽ dùng nên nó giữ hết.
   *
   * Import đích danh thì rẻ — đo ngày 27/11/2026: thư viện tốn 1.13 kB gzip,
   * mỗi icon thêm vào khoảng 82 byte. Mười sáu icon hết 2.36 kB.
   */
  it('không import cả namespace từ lucide-react', () => {
    const pham = TEP.filter((t) =>
      /import\s+\*\s+as\s+\w+\s+from\s+['"]lucide-react['"]/.test(readFileSync(t, 'utf8')),
    )
    expect(pham, 'dùng import đích danh: import { Check } from "lucide-react"').toEqual([])
  })

  /**
   * Tra icon theo tên lúc chạy cũng buộc phải giữ cả thư viện, kể cả khi
   * không viết `import * as`. Thấy dạng này thì đổi sang một bảng khai báo
   * tường minh ánh xạ tên sang component đã import đích danh.
   */
  it('không tra component icon bằng chuỗi lúc chạy', () => {
    const pham = TEP.filter((t) => {
      const ma = readFileSync(t, 'utf8')
      return /from\s+['"]lucide-react['"]/.test(ma) && /\bicons\s*\[/i.test(ma)
    })
    expect(pham, 'khai báo một bảng tên tường minh thay vì tra bằng chuỗi').toEqual([])
  })
})
