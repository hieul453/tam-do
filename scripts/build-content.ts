/**
 * Chuyển `content/chuong-*.md` thành JSON cho app đọc.
 *
 *   npm run content:build    đọc, kiểm tra, rồi ghi ra src/content/generated/
 *   npm run content:check    chỉ kiểm tra, không ghi gì (CI dùng cái này)
 *
 * Thông báo lỗi viết bằng tiếng Việt và chỉ đúng tên bài, vì người đọc nó là
 * người soạn nội dung chứ không phải lập trình viên.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Chuong } from '../src/content/schema'
import { phanTichChuong } from './lib/parse-chuong'

const goc = join(dirname(fileURLToPath(import.meta.url)), '..')
const thuMucNoiDung = join(goc, 'content')
const thuMucRa = join(goc, 'src', 'content', 'generated')

const chiKiemTra = process.argv.includes('--check')

const do_ = '\x1b[31m'
const xanh = '\x1b[32m'
const vang = '\x1b[33m'
const mo = '\x1b[2m'
const het = '\x1b[0m'

type Loi = { file: string; cho: string; thongDiep: string }
const loi: Loi[] = []

function duongDanTiengViet(
  path: (string | number)[],
  chuong: ReturnType<typeof phanTichChuong>,
): string {
  // Biến ["bai", 3, "daoSau", "nguon"] thành "Bài 6.4 › Đào sâu › nguồn"
  const phan: string[] = []
  for (let i = 0; i < path.length; i++) {
    const p = path[i]
    if (p === 'bai' && typeof path[i + 1] === 'number') {
      const b = chuong.bai[path[i + 1] as number]
      phan.push(`Bài ${b ? b.so : path[i + 1]}`)
      i++
      continue
    }
    const ten: Record<string, string> = {
      hieuNhanh: 'Hiểu nhanh',
      daoSau: 'Đào sâu',
      apDung: 'Áp dụng',
      baDieuCanNho: '3 điều cần nhớ',
      thuatNgu: 'thuật ngữ',
      lienKet: 'liên kết',
      nguon: 'nguồn đã kiểm chứng',
      seHieu: 'câu "Đọc xong bạn sẽ hiểu…"',
      thuThach: 'thử thách',
      tuSoi: 'câu hỏi tự soi',
      dungNgay: 'dùng ngay',
      cauChuyen: 'câu chuyện',
      tongKet: 'tổng kết chương',
      canNam: 'những điều cần nắm',
      apDungBanThan: 'áp dụng cho bản thân',
      minhHoa: 'dòng 🎨 Minh họa',
      cauHoiChuong: 'câu hỏi chương',
    }
    phan.push(ten[String(p)] ?? String(p))
  }
  return phan.join(' › ')
}

const files = existsSync(thuMucNoiDung)
  ? readdirSync(thuMucNoiDung)
      .filter((f) => /^chuong-\d+.*\.md$/.test(f))
      .sort()
  : []

if (files.length === 0) {
  console.error(`${do_}Không tìm thấy file nào dạng content/chuong-XX-*.md${het}`)
  process.exit(1)
}

const ketQua: Array<{ file: string; data: unknown; id: string; soBai: number; tieuDe: string }> = []

for (const file of files) {
  const raw = readFileSync(join(thuMucNoiDung, file), 'utf8')
  const tho = phanTichChuong(raw)
  const kiem = Chuong.safeParse(tho)

  if (!kiem.success) {
    for (const issue of kiem.error.issues) {
      loi.push({
        file,
        cho: duongDanTiengViet(issue.path as (string | number)[], tho),
        thongDiep: issue.message,
      })
    }
    continue
  }
  ketQua.push({
    file,
    data: kiem.data,
    id: kiem.data.id,
    soBai: kiem.data.bai.length,
    tieuDe: kiem.data.tieuDe,
  })
}

console.log('')
for (const r of ketQua) {
  const soThe = (r.data as { bai: Array<{ hieuNhanh: unknown[] }> }).bai.reduce(
    (n, b) => n + b.hieuNhanh.length,
    0,
  )
  console.log(`  ${xanh}✓${het} ${r.file}  ${mo}→ ${r.soBai} bài, ${soThe} thẻ${het}`)
}

if (loi.length > 0) {
  console.log('')
  console.log(`${do_}Nội dung chưa đạt — ${loi.length} chỗ cần sửa:${het}`)
  let fileHienTai = ''
  for (const l of loi) {
    if (l.file !== fileHienTai) {
      console.log(`\n  ${vang}${l.file}${het}`)
      fileHienTai = l.file
    }
    console.log(`    • ${l.cho}`)
    console.log(`      ${mo}${l.thongDiep}${het}`)
  }
  console.log('')
  console.log(`${mo}  Mở file markdown ở trên và bổ sung mục còn thiếu, rồi chạy lại.${het}`)
  console.log(`${mo}  Khuôn một bài đầy đủ xem ở docs/SPEC-SAN-PHAM.md mục 6.${het}`)
  console.log('')
  process.exit(1)
}

if (chiKiemTra) {
  console.log(`\n${xanh}Nội dung hợp lệ.${het} (chỉ kiểm tra, không ghi file)\n`)
  process.exit(0)
}

rmSync(thuMucRa, { recursive: true, force: true })
mkdirSync(thuMucRa, { recursive: true })

for (const r of ketQua) {
  writeFileSync(join(thuMucRa, `${r.id}.json`), JSON.stringify(r.data, null, 2), 'utf8')
}

writeFileSync(
  join(thuMucRa, '.gitkeep'),
  '# Thư mục này do scripts/build-content.ts sinh ra. Đừng sửa tay.\n',
  'utf8',
)

console.log(`\n${xanh}Đã ghi ${ketQua.length} chương${het} vào src/content/generated/\n`)
