// Dùng đường dẫn tương đối, không dùng alias "@/": tsx chạy script ngoài Vite
// nên không chắc đọc được paths trong tsconfig.
import type {
  ApDung,
  CauChuyen,
  DaoSau,
  LoaiThe,
  NhanBai,
  Nguon,
  The,
  ThuatNgu,
} from '../../src/content/schema'

/**
 * Chuyển một file `content/chuong-XX-*.md` thành dữ liệu.
 *
 * Nguyên tắc: parser **dễ tính**, schema **khó tính**.
 * Ở đây cố gắng đọc ra được càng nhiều càng tốt và không ném lỗi vặt; việc
 * phán xét "bài này thiếu mục bắt buộc" để Zod làm, vì nó cho ra thông báo
 * chỉ đúng tên trường bị thiếu.
 *
 * Lý do tách riêng khỏi script build: để test được mà không cần đụng đĩa.
 */

// Nhãn bài nằm ở cuối dòng tiêu đề, dạng emoji.
const EMOJI_NHAN: Array<[string, NhanBai]> = [
  ['🟢', 'trong-tam'],
  ['🔵', 'mo-rong'],
  ['⚠️', 'da-cap-nhat'],
  ['🇻🇳', 'viet-nam'],
]

// Các mốc chia tầng trong một bài. Dòng tiêu đề có thể có chữ thêm phía sau,
// ví dụ "**⚡ Hiểu nhanh** (mỗi gạch đầu dòng là một thẻ)".
const MOC = {
  hieuNhanh: /^\*\*⚡ Hiểu nhanh\*\*.*$/m,
  daoSau: /^\*\*📖 Đào sâu\*\*.*$/m,
  baDieu: /^\*\*3 điều cần nhớ\*\*.*$/m,
  moRong: /^\*\*Mở rộng\*\*.*$/m,
  apDung: /^\*\*🌱 Áp dụng\*\*.*$/m,
} as const

type ViTri = { dau: number; cuoi: number } | null

/** Tìm vị trí một mốc: `dau` là chỗ bắt đầu dòng mốc, `cuoi` là chỗ kết thúc dòng đó. */
function timMoc(text: string, re: RegExp): ViTri {
  const m = re.exec(text)
  if (!m || m.index === undefined) return null
  return { dau: m.index, cuoi: m.index + m[0].length }
}

function catDoan(text: string, tu: number | null, den: number | null): string {
  if (tu === null) return ''
  return text.slice(tu, den ?? text.length).trim()
}

/** Tách một khối thành các đoạn văn (ngăn bởi dòng trống). */
function doanVan(block: string): string[] {
  return block
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Bỏ dấu ** và * quanh một chuỗi. */
function boDamNghieng(s: string): string {
  return s
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*(.+?)\*(?=\s|$)/g, '$1$2')
    .trim()
}

/** Các gạch đầu dòng `- ...`, nối các dòng xuống dòng thuộc cùng một mục. */
function gachDauDong(block: string): string[] {
  const out: string[] = []
  for (const raw of block.split('\n')) {
    const line = raw.trimEnd()
    if (/^\s*[-*]\s+/.test(line)) {
      out.push(line.replace(/^\s*[-*]\s+/, '').trim())
    } else if (out.length > 0 && line.trim() && !/^\s*\*\*/.test(line)) {
      out[out.length - 1] += ' ' + line.trim()
    }
  }
  return out
}

/** Các mục đánh số `1. ...`, nối dòng tiếp theo nếu có. */
function danhSachSo(block: string): string[] {
  const out: string[] = []
  for (const raw of block.split('\n')) {
    const line = raw.trimEnd()
    if (/^\s*\d+\.\s+/.test(line)) {
      out.push(line.replace(/^\s*\d+\.\s+/, '').trim())
    } else if (out.length > 0 && line.trim() && !/^\s*\*\*/.test(line)) {
      out[out.length - 1] += ' ' + line.trim()
    }
  }
  return out
}

/** Lấy giá trị của một gạch đầu dòng dạng `- *Nhãn:* nội dung`. */
function mucNghieng(bullets: string[], nhan: string): string | null {
  const found = bullets.find((b) => b.startsWith(`*${nhan}:*`))
  if (!found) return null
  return found.slice(`*${nhan}:*`.length).trim()
}

/** Lấy giá trị của một gạch đầu dòng dạng `- **Nhãn:** nội dung`. */
function mucDam(bullets: string[], batDau: string): { nhan: string; noiDung: string } | null {
  for (const b of bullets) {
    const m = /^\*\*(.+?):?\*\*\s*(.*)$/s.exec(b)
    if (!m) continue
    const nhan = m[1].trim()
    if (nhan.toLowerCase().startsWith(batDau.toLowerCase())) {
      return { nhan, noiDung: m[2].trim() }
    }
  }
  return null
}

function tachDau(s: string, dau = '·'): string[] {
  return s
    .split(dau)
    .map((x) => x.trim())
    .filter(Boolean)
}

// ---------------------------------------------------------------------------

export function doanLoaiThe(nhan: string, ghiChu: string): LoaiThe {
  const g = ghiChu.toLowerCase()
  if (g.includes('tương tác') || g.includes('kéo thả')) return 'tuong-tac'
  if (g.includes('thẻ hình')) return 'hinh'

  const n = nhan.toLowerCase()
  if (n.startsWith('đoán thử')) return 'doan-thu'
  if (n.startsWith('hình dung')) return 'hinh'
  if (n.startsWith('thử ngay') || n.startsWith('xếp nhóm')) return 'tuong-tac'
  if (n.startsWith('ví dụ')) return 'vi-du'
  if (n.startsWith('kiểm tra')) return 'kiem-tra'
  return 'y-chinh'
}

export function phanTichThe(dong: string, id: string): The | null {
  // Dạng gặp trong nội dung:
  //   **Ý chính:** nội dung
  //   **Hình dung** *(thẻ hình)*: nội dung
  const m = /^\*\*(.+?)\*\*\s*(.*)$/s.exec(dong.trim())
  if (!m) return null

  let nhan = m[1].trim().replace(/:$/, '')
  let con = m[2].trim()

  // Ghi chú in nghiêng ngay sau nhãn cho biết đây là loại thẻ gì.
  let ghiChu = ''
  const gc = /^\*\((.+?)\)\*\s*:?\s*/.exec(con)
  if (gc) {
    ghiChu = gc[1]
    con = con.slice(gc[0].length).trim()
  }
  con = con.replace(/^[:：]\s*/, '').trim()

  if (!con) return null
  return { id, loai: doanLoaiThe(nhan, ghiChu), nhan, noiDung: con }
}

export function phanTichThuatNgu(raw: string): ThuatNgu[] {
  return tachDau(raw).map((t) => {
    const m = /^(.*?)\s*\((.+?)\)\s*$/.exec(t.trim())
    if (m) return { vi: boDamNghieng(m[1]), en: m[2].trim() }
    return { vi: boDamNghieng(t), en: null }
  })
}

export function phanTichNguon(raw: string): Nguon[] {
  return tachDau(raw).map((s) => {
    const m = /^\[(.+?)\]\((https?:\/\/[^)]+)\)$/.exec(s.trim())
    if (m) return { ten: m[1].trim(), url: m[2].trim() }
    return { ten: boDamNghieng(s), url: null }
  })
}

function phanTichCauChuyen(doans: string[]): CauChuyen[] {
  const ra: CauChuyen[] = []
  let hienTai: CauChuyen | null = null

  for (const p of doans) {
    if (p.startsWith('**Câu chuyện')) {
      if (hienTai) ra.push(hienTai)
      // "**Câu chuyện 1: Một động từ đổi cả vụ tai nạn.** Năm 1974, ..."
      const m = /^\*\*(.+?)\*\*\s*(.*)$/s.exec(p)
      const tieuDe = m
        ? m[1]
            .replace(/^Câu chuyện\s*\d*\s*[:.]?\s*/, '')
            .replace(/\.$/, '')
            .trim()
        : 'Câu chuyện'
      hienTai = { tieuDe: tieuDe || 'Câu chuyện', than: m ? m[2].trim() : p, nghiaLa: null }
      continue
    }
    if (!hienTai) continue

    if (p.startsWith('**Nghĩa là:**')) {
      hienTai.nghiaLa = p.replace('**Nghĩa là:**', '').trim()
      ra.push(hienTai)
      hienTai = null
      continue
    }
    // Đoạn mở đầu bằng in đậm khác (bảng, hộp cập nhật…) thì câu chuyện đã hết.
    if (p.startsWith('**') || p.startsWith('|')) {
      ra.push(hienTai)
      hienTai = null
      continue
    }
    hienTai.than += '\n\n' + p
  }
  if (hienTai) ra.push(hienTai)
  return ra
}

function doanBatDauBang(doans: string[], ...tienTo: string[]): string | null {
  for (const p of doans) {
    for (const t of tienTo) {
      if (p.startsWith(t)) return p.slice(t.length).trim()
    }
  }
  return null
}

// ---------------------------------------------------------------------------

export type KetQuaBai = {
  so: string
  thuTu: number
  tieuDe: string
  nhan: NhanBai[]
  minhHoa: string[]
  hieuNhanh: The[]
  daoSau: DaoSau
  apDung: ApDung
}

export function phanTichBai(khoi: string, idChuong: string, thuTu: number): KetQuaBai {
  const dongTieuDe = /^###\s+Bài\s+([\d.]+?)\.?\s+(.+)$/m.exec(khoi)
  const so = dongTieuDe ? dongTieuDe[1] : String(thuTu)
  let tieuDe = dongTieuDe ? dongTieuDe[2].trim() : ''

  const nhan: NhanBai[] = []
  for (const [emoji, ten] of EMOJI_NHAN) {
    if (tieuDe.includes(emoji)) {
      nhan.push(ten)
      tieuDe = tieuDe.split(emoji).join('')
    }
  }
  tieuDe = tieuDe.trim()

  const id = `${idChuong}-${String(thuTu).padStart(2, '0')}`

  // 🎨 Minh họa: (1) ...; (2) ...
  const mh = /^🎨\s*Minh họa:\s*(.+)$/m.exec(khoi)
  const minhHoa = mh
    ? mh[1]
        .split(';')
        .map((x) => x.replace(/^\s*\(\d+\)\s*/, '').trim())
        .filter(Boolean)
    : []

  const vHieuNhanh = timMoc(khoi, MOC.hieuNhanh)
  const vDaoSau = timMoc(khoi, MOC.daoSau)
  const vBaDieu = timMoc(khoi, MOC.baDieu)
  const vMoRong = timMoc(khoi, MOC.moRong)
  const vApDung = timMoc(khoi, MOC.apDung)

  // --- Hiểu nhanh ---------------------------------------------------------
  const khoiHieuNhanh = catDoan(khoi, vHieuNhanh?.cuoi ?? null, vDaoSau?.dau ?? null)
  const hieuNhanh = danhSachSo(khoiHieuNhanh)
    .map((d, i) => phanTichThe(d, `${id}-c${i + 1}`))
    .filter((t): t is The => t !== null)

  // --- Đào sâu ------------------------------------------------------------
  const than = catDoan(khoi, vDaoSau?.cuoi ?? null, vBaDieu?.dau ?? null)
  const doans = doanVan(than)

  // Dòng in nghiêng mở đầu: "*Đọc xong bạn sẽ hiểu: … Khoảng 5 phút đọc.*"
  let seHieu = ''
  let phutDoc: number | null = null
  const dongNghieng = doans.find((p) => p.startsWith('*') && !p.startsWith('**'))
  if (dongNghieng) {
    const noi = dongNghieng.replace(/^\*/, '').replace(/\*$/, '').trim()
    const mp = /Khoảng\s+(\d+)\s*phút/.exec(noi)
    if (mp) phutDoc = Number(mp[1])
    seHieu = noi
      .replace(/^Đọc xong bạn sẽ hiểu:?\s*/i, '')
      .replace(/\.?\s*Khoảng\s+\d+\s*phút đọc\.?\s*$/i, '')
      .trim()
  }

  const conLai = doans.filter((p) => p !== dongNghieng)

  const daoSau: DaoSau = {
    seHieu,
    phutDoc,
    than: conLai.join('\n\n'),
    cauChuyen: phanTichCauChuyen(conLai),
    capNhat: doanBatDauBang(
      conLai,
      '**⚠️ Cập nhật kiến thức.**',
      '**🇻🇳 Cập nhật kiến thức.**',
      '**Cập nhật kiến thức.**',
    ),
    tranhCai: doanBatDauBang(conLai, '**Còn đang tranh cãi.**', '**Còn đang tranh cãi:**'),
    baDieuCanNho: danhSachSo(catDoan(khoi, vBaDieu?.cuoi ?? null, vMoRong?.dau ?? null)),
    thuatNgu: [],
    lienKet: [],
    nguon: [],
  }

  // --- Mở rộng ------------------------------------------------------------
  const bulletsMoRong = gachDauDong(catDoan(khoi, vMoRong?.cuoi ?? null, vApDung?.dau ?? null))
  const tn = mucNghieng(bulletsMoRong, 'Thuật ngữ')
  const lk = mucNghieng(bulletsMoRong, 'Liên kết')
  const ng = mucNghieng(bulletsMoRong, 'Nguồn đã kiểm chứng')
  if (tn) daoSau.thuatNgu = phanTichThuatNgu(tn)
  if (lk) daoSau.lienKet = tachDau(lk).map(boDamNghieng)
  if (ng) daoSau.nguon = phanTichNguon(ng)

  // --- Áp dụng ------------------------------------------------------------
  const bulletsApDung = gachDauDong(catDoan(khoi, vApDung?.cuoi ?? null, null))
  const tt = mucDam(bulletsApDung, 'Thử thách')
  const ts = mucDam(bulletsApDung, 'Câu hỏi tự soi')
  const dn = mucDam(bulletsApDung, 'Dùng ngay')
  const cg = mucDam(bulletsApDung, 'Khi nào nên tìm chuyên gia')

  const apDung: ApDung = {
    thuThach: { nhan: tt?.nhan ?? '', noiDung: tt?.noiDung ?? '' },
    tuSoi: ts?.noiDung ?? '',
    dungNgay: dn?.noiDung ?? '',
    timChuyenGia: cg?.noiDung ?? null,
  }

  return { so, thuTu, tieuDe, nhan, minhHoa, hieuNhanh, daoSau, apDung }
}

// ---------------------------------------------------------------------------

export type KetQuaChuong = {
  id: string
  so: number
  tieuDe: string
  cauHoiChuong: string
  bai: Array<KetQuaBai & { id: string }>
  tongKet: { canNam: string[]; apDungBanThan: string[] }
}

export function phanTichChuong(markdown: string, maMon = 'tlhdc'): KetQuaChuong {
  const text = markdown.replace(/\r\n/g, '\n')

  const h1 = /^#\s+Chương\s+(\d+)\s*[–-]\s*(.+)$/m.exec(text)
  const so = h1 ? Number(h1[1]) : 0
  const tieuDe = h1 ? h1[2].trim() : ''
  const id = `${maMon}-${String(so).padStart(2, '0')}`

  const ch = /^\*\*Câu hỏi chương:\*\*\s*(.+)$/m.exec(text)
  let cauHoiChuong = ch ? ch[1].trim() : ''
  // Dòng này hay kèm ghi chú cho người làm app ("Trong app, màn hình chương…").
  // Chỉ giữ chính câu hỏi.
  const dauHoi = cauHoiChuong.indexOf('?')
  if (dauHoi !== -1) cauHoiChuong = cauHoiChuong.slice(0, dauHoi + 1).trim()

  // Cắt các bài theo tiêu đề "### Bài ".
  const khoiBai: string[] = []
  const re = /^###\s+Bài\s+/gm
  const moc: number[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) moc.push(m.index)
  for (let i = 0; i < moc.length; i++) {
    khoiBai.push(text.slice(moc[i], moc[i + 1] ?? text.length))
  }

  const bai = khoiBai.map((k, i) => {
    const b = phanTichBai(k, id, i + 1)
    return { ...b, id: `${id}-${String(i + 1).padStart(2, '0')}` }
  })

  // --- Tổng kết chương ----------------------------------------------------
  const vTongKet = /^##\s+Tổng kết chương.*$/m.exec(text)
  let canNam: string[] = []
  let apDungBanThan: string[] = []
  if (vTongKet && vTongKet.index !== undefined) {
    const khoi = text.slice(vTongKet.index)
    const vCanNam = timMoc(khoi, /^\*\*Những điều cần nắm\*\*.*$/m)
    const vApDung = timMoc(khoi, /^\*\*Áp dụng cho bản thân\*\*.*$/m)
    const vDuyet = timMoc(khoi, /^\*\*Những điểm cần bạn duyệt\*\*.*$/m)
    canNam = gachDauDong(catDoan(khoi, vCanNam?.cuoi ?? null, vApDung?.dau ?? null))
    apDungBanThan = gachDauDong(catDoan(khoi, vApDung?.cuoi ?? null, vDuyet?.dau ?? null))
  }

  return { id, so, tieuDe, cauHoiChuong, bai, tongKet: { canNam, apDungBanThan } }
}
