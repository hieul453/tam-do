import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chuong } from '../../src/content/schema'
import {
  doanLoaiThe,
  phanTichChuong,
  phanTichNguon,
  phanTichThe,
  phanTichThuatNgu,
} from './parse-chuong'

const goc = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
// Chuẩn hoá xuống dòng: trên Windows git trả về CRLF, làm mọi phép cắt chuỗi
// trong test trượt mà không báo gì. phanTichChuong tự chuẩn hoá bên trong nên
// các test khác không lộ ra lỗi này.
const chuong6 = readFileSync(join(goc, 'content', 'chuong-06-tri-nho.md'), 'utf8').replace(
  /\r\n/g,
  '\n',
)

/**
 * Các test này khoá lại cách đọc markdown của người soạn nội dung.
 * Nếu sau này đổi parser mà làm hỏng một trong số chúng, nghĩa là nội dung
 * đã soạn sẽ bị đọc sai — nặng hơn một lỗi code thông thường.
 */

describe('phanTichChuong với nội dung thật của chương 6', () => {
  const kq = phanTichChuong(chuong6)

  it('đọc đúng thông tin chương', () => {
    expect(kq.id).toBe('tlhdc-06')
    expect(kq.so).toBe(6)
    expect(kq.tieuDe).toBe('Trí nhớ')
    expect(kq.cauHoiChuong).toMatch(/^Ta lưu giữ quá khứ.*\?$/)
  })

  it('câu hỏi chương không dính ghi chú dành cho người làm app', () => {
    expect(kq.cauHoiChuong).not.toContain('Trong app')
  })

  it('tách đủ 7 bài, id và số bài đúng thứ tự', () => {
    expect(kq.bai).toHaveLength(7)
    expect(kq.bai.map((b) => b.id)).toEqual([
      'tlhdc-06-01',
      'tlhdc-06-02',
      'tlhdc-06-03',
      'tlhdc-06-04',
      'tlhdc-06-05',
      'tlhdc-06-06',
      'tlhdc-06-07',
    ])
    expect(kq.bai.map((b) => b.so)).toEqual(['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7'])
  })

  it('bỏ emoji khỏi tiêu đề và chuyển thành nhãn', () => {
    const b6 = kq.bai[5]
    expect(b6.tieuDe).toBe('Vì sao ta có thể nhớ sai mà vẫn rất chắc chắn?')
    expect(b6.tieuDe).not.toMatch(/[🟢🔵⚠️]/)
    expect(b6.nhan).toEqual(['trong-tam', 'da-cap-nhat'])
    expect(kq.bai[6].nhan).toEqual(['mo-rong'])
  })

  it('thẻ cuối của mọi bài đều là thẻ kiểm tra', () => {
    for (const b of kq.bai) {
      expect(b.hieuNhanh.at(-1)?.loai, `bài ${b.so}`).toBe('kiem-tra')
    }
  })

  it('mỗi bài có đúng 3 điều cần nhớ', () => {
    for (const b of kq.bai) {
      expect(b.daoSau.baDieuCanNho, `bài ${b.so}`).toHaveLength(3)
    }
  })

  it('mọi bài đều có nguồn đã kiểm chứng', () => {
    for (const b of kq.bai) {
      expect(b.daoSau.nguon.length, `bài ${b.so}`).toBeGreaterThan(0)
    }
  })

  it('mọi bài đều có dòng minh họa và thời gian đọc', () => {
    for (const b of kq.bai) {
      expect(b.minhHoa.length, `bài ${b.so}`).toBeGreaterThan(0)
      expect(b.daoSau.phutDoc, `bài ${b.so}`).toBeGreaterThan(0)
    }
  })

  it('giữ nguyên bảng markdown trong phần thân Đào sâu', () => {
    expect(kq.bai[5].daoSau.than).toContain('| Nhóm | Lỗi |')
  })

  it('đọc được câu chuyện kèm câu "Nghĩa là"', () => {
    const cc = kq.bai[5].daoSau.cauChuyen
    expect(cc).toHaveLength(3)
    expect(cc[0].tieuDe).toBe('Một động từ đổi cả vụ tai nạn')
    expect(cc[0].nghiaLa).toContain('viết lại ký ức')
  })

  it('chỉ bài về ký ức đau buồn mới có mục tìm chuyên gia', () => {
    const coChuyenGia = kq.bai.filter((b) => b.apDung.timChuyenGia !== null).map((b) => b.so)
    expect(coChuyenGia).toEqual(['6.6'])
  })

  it('giữ nguyên thời hạn trong nhãn thử thách', () => {
    expect(kq.bai[5].apDung.thuThach.nhan).toBe('Thử thách 3 ngày')
    expect(kq.bai[6].apDung.thuThach.nhan).toBe('Thử thách 2 tuần')
  })

  it('đọc được tổng kết chương, không lẫn phần cần duyệt', () => {
    expect(kq.tongKet.canNam.length).toBeGreaterThan(0)
    expect(kq.tongKet.apDungBanThan.length).toBeGreaterThan(0)
    const tatCa = [...kq.tongKet.canNam, ...kq.tongKet.apDungBanThan].join(' ')
    expect(tatCa).not.toContain('[ ]')
  })

  it('qua được schema', () => {
    const kiem = Chuong.safeParse(kq)
    expect(kiem.success, kiem.success ? '' : JSON.stringify(kiem.error.issues, null, 2)).toBe(true)
  })
})

describe('doanLoaiThe', () => {
  it('ưu tiên ghi chú in nghiêng hơn nhãn', () => {
    expect(doanLoaiThe('Xếp nhóm', 'thẻ kéo thả')).toBe('tuong-tac')
    expect(doanLoaiThe('Hình dung', 'thẻ hình')).toBe('hinh')
  })

  it('suy từ nhãn khi không có ghi chú', () => {
    expect(doanLoaiThe('Đoán thử', '')).toBe('doan-thu')
    expect(doanLoaiThe('Thử ngay', '')).toBe('tuong-tac')
    expect(doanLoaiThe('Ví dụ', '')).toBe('vi-du')
    expect(doanLoaiThe('Kiểm tra (áp dụng)', '')).toBe('kiem-tra')
  })

  it('nhãn lạ thì coi là ý chính, không làm vỡ build', () => {
    expect(doanLoaiThe('Mẹo', '')).toBe('y-chinh')
    expect(doanLoaiThe('Kết quả', '')).toBe('y-chinh')
    expect(doanLoaiThe('Nhãn chưa từng gặp', '')).toBe('y-chinh')
  })
})

describe('phanTichThe', () => {
  it('đọc dạng **Nhãn:** nội dung', () => {
    const t = phanTichThe('**Ý chính:** Trí nhớ gồm 3 bước.', 'x-c1')
    expect(t).toEqual({
      id: 'x-c1',
      loai: 'y-chinh',
      nhan: 'Ý chính',
      noiDung: 'Trí nhớ gồm 3 bước.',
    })
  })

  it('đọc dạng **Nhãn** *(ghi chú)*: nội dung và bỏ ghi chú khỏi nội dung', () => {
    const t = phanTichThe('**Thử ngay** *(thẻ tương tác)*: dãy số 7358310 hiện 3 giây.', 'x-c2')
    expect(t?.loai).toBe('tuong-tac')
    expect(t?.nhan).toBe('Thử ngay')
    expect(t?.noiDung).toBe('dãy số 7358310 hiện 3 giây.')
  })

  it('trả về null nếu không có nội dung', () => {
    expect(phanTichThe('**Chỉ có nhãn:**', 'x-c3')).toBeNull()
  })
})

describe('phanTichThuatNgu', () => {
  it('tách cặp Việt – Anh', () => {
    expect(phanTichThuatNgu('mã hóa (encoding) · hồi hải mã (hippocampus)')).toEqual([
      { vi: 'mã hóa', en: 'encoding' },
      { vi: 'hồi hải mã', en: 'hippocampus' },
    ])
  })

  it('chấp nhận thuật ngữ không có tiếng Anh', () => {
    expect(phanTichThuatNgu('tổng giác')).toEqual([{ vi: 'tổng giác', en: null }])
  })
})

describe('phanTichNguon', () => {
  it('tách được liên kết markdown', () => {
    const n = phanTichNguon('[Loftus & Palmer (1974)](https://vi.du/abc) · Schacter (2001), *sách*')
    expect(n[0]).toEqual({ ten: 'Loftus & Palmer (1974)', url: 'https://vi.du/abc' })
    expect(n[1].url).toBeNull()
    expect(n[1].ten).toContain('Schacter (2001)')
  })
})

describe('nội dung thiếu mục bắt buộc thì schema phải chặn', () => {
  it('bài không có thẻ kiểm tra ở cuối bị từ chối', () => {
    const hong = chuong6.replace(
      '**Kiểm tra (áp dụng):** Gặp lại người quen',
      '**Ý chính 3:** Gặp lại người quen',
    )
    const kiem = Chuong.safeParse(phanTichChuong(hong))
    expect(kiem.success).toBe(false)
    if (!kiem.success) {
      expect(JSON.stringify(kiem.error.issues)).toContain('Kiểm tra')
    }
  })

  it('bài thiếu phần 3 điều cần nhớ bị từ chối', () => {
    const hong = chuong6.replace(/^\*\*3 điều cần nhớ\*\*$/m, '**Vài điều cần nhớ**')
    const kiem = Chuong.safeParse(phanTichChuong(hong))
    expect(kiem.success).toBe(false)
  })

  // Người đọc thông báo lỗi là người soạn nội dung, không phải lập trình viên.
  // Để lọt một thông điệp tiếng Anh của Zod là mất tác dụng của cả cái cổng này.
  it('thông báo lỗi viết bằng tiếng Việt, không phải nguyên văn của Zod', () => {
    const truongHop: Array<[string, string, RegExp]> = [
      [
        'thiếu một dòng trong 3 điều cần nhớ',
        chuong6.replace('3. Biết mình quên ở bước nào giúp chọn đúng cách sửa.\n', ''),
        /đúng 3 gạch đầu dòng/,
      ],
      [
        'thiếu nguồn đã kiểm chứng',
        chuong6.replace(/^- \*Nguồn đã kiểm chứng:\*.*$/m, ''),
        /Nguồn đã kiểm chứng/,
      ],
      [
        'thiếu gạch đầu dòng Dùng ngay',
        chuong6.replace(/^- \*\*Dùng ngay:\*\*.*$/m, ''),
        /Dùng ngay/,
      ],
      [
        'sai nhãn Câu hỏi chương',
        chuong6.replace('**Câu hỏi chương:**', '**Câu hỏi:**'),
        /Câu hỏi chương/,
      ],
    ]

    for (const [ten, hong, mong] of truongHop) {
      const kiem = Chuong.safeParse(phanTichChuong(hong))
      expect(kiem.success, `"${ten}" lẽ ra phải bị chặn`).toBe(false)
      if (kiem.success) continue

      const thongDiep = kiem.error.issues.map((i) => i.message).join(' | ')
      expect(thongDiep, `"${ten}" — thông điệp: ${thongDiep}`).toMatch(mong)
      // Zod mặc định nói tiếng Anh; nếu thấy mấy chuỗi này là đã lọt.
      expect(thongDiep, `"${ten}" còn thông điệp tiếng Anh của Zod`).not.toMatch(
        /Too small|Too big|Invalid input|Required/,
      )
    }
  })
})
