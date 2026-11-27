#!/usr/bin/env node
// Dọn một ảnh linh vật về đúng chín màu chuẩn, mảng nào cũng bệt tuyệt đối.
//
//   node scripts/don-anh-linh-vat.mjs <vao.png> <ra.png> [--khung 70]
//
// VÌ SAO CẦN: máy sinh ảnh phủ một lớp nhiễu rất mảnh lên toàn ảnh — nền đáng
// lẽ một màu thì có hàng chục sắc kem chênh nhau 2–3 mức. Mắt gần như không
// thấy, nhưng nó phá hai thứ: ảnh tham chiếu dạy máy sau vẽ nhiễu theo, và
// tách nền bằng máy thì không có màu nào để khoá. Bóng mềm và màu nền trôi
// cũng cùng gốc ấy.
//
// CÁCH LÀM — ÉP MÀU THEO VÙNG, không theo từng pixel. Snap từng pixel về màu gần
// nhất thì giết luôn khử răng cưa, nét sẽ răng cưa khi thu nhỏ. Nên:
//
//   - xếp mỗi pixel vào màu chuẩn gần nhất
//   - pixel nào có cả vùng quanh nó cùng một hạng thì nó nằm trong LÒNG một
//     mảng đặc → ép về màu chuẩn
//   - pixel nào có vùng quanh chia hai hạng thì nó nằm trên RANH GIỚI → giữ
//     nguyên, đó chính là khử răng cưa
//
// Hệ quả đúng ý: nhiễu trong mảng lớn bị ép sạch; viền dày vài pixel thì ruột
// bị ép còn hai mép giữ mềm; bóng mềm trải 40px thì gần hết bị ép về một trong
// hai phía, thành mép cứng; còn nét mảnh 1–2px thì không có ruột nên giữ nguyên.
//
// KHÔNG CHỮA VIỀN THÂN TỰ ĐỘNG. Luật của bộ này là thân viền ám màu, phụ kiện
// và tay chân viền mực. Máy sinh ảnh chỉ giữ được khoảng một nửa: đo trên ảnh
// đã ép màu thì gần 50% mép thân Tim phân loại thành mực.
//
// Đã thử chữa bằng máy và bỏ. Chỗ ink trên mép thân và chỗ ink của viền chụp
// tai nằm sát nhau, không tách được bằng hình học: chặn theo bán kính thì ăn
// mất viền chụp tai, chừa vùng quanh bạc hà thì chỉ còn đổi được 1.384 pixel,
// tức là không đổi gì. Một phép vá nửa vời âm thầm làm hỏng phụ kiện thì tệ
// hơn là không vá.
//
// Nên: script ĐO và BÁO chỗ đó, còn sửa thì để người làm — nó là đúng một
// đường nét trong bất kỳ công cụ vẽ nào. do-linh-vat.mjs in ra tỉ lệ.

// LƯU Ý VỀ DẤU GHI NGUỒN: ngôi sao watermark của máy sinh ảnh chỉ lệch nền vài
// mức sáng, nên nó nằm gọn trong hạng "giấy" và bị ép thành nền — tức là BIẾN
// MẤT. Đây là hệ quả của việc ép màu, không phải mục đích. Script in ra rõ
// ràng khi điều đó xảy ra. Việc ba ảnh này do AI sinh đã ghi trong
// docs/linh-vat/LINH-VAT.md; đừng xoá dòng đó.

import { docPng, ghiPng } from './anh-png.mjs'

const BANG = [
  ['thân Não', 0x90, 0x97, 0xde],
  ['viền Não', 0x5f, 0x66, 0xac],
  ['thân Tim', 0xd4, 0x6b, 0x76],
  ['viền Tim', 0x8f, 0x40, 0x4a],
  ['bạc hà', 0x9b, 0xe5, 0xc5],
  ['mực', 0x0b, 0x0b, 0x12],
  ['trắng mắt', 0xff, 0xff, 0xff],
  ['giấy', 0xf5, 0xf4, 0xe9],
  ['bóng', 0xe0, 0xd8, 0xc8],
]
const K_THAN_NAO = 0,
  K_VIEN_NAO = 1,
  K_THAN_TIM = 2,
  K_VIEN_TIM = 3
const K_BAC_HA = 4,
  K_MUC = 5,
  K_GIAY = 7

const O = 2 // nửa cạnh cửa sổ xét quanh mỗi pixel → cửa sổ 5×5
const DAC = 0.84 // tỉ lệ cùng hạng trong cửa sổ để coi là nằm trong lòng mảng

const hex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

// ---------------------------------------------------------------- tham số

const [vao, ra, ...cua] = process.argv.slice(2)
if (!vao || !ra) {
  console.error(
    'Thiếu đường dẫn.\n' +
      '  node scripts/don-anh-linh-vat.mjs <vao.png> <ra.png> [--khung 70] [--giu-vien]',
  )
  process.exit(1)
}
const iK = cua.indexOf('--khung')
const khungMuon = iK >= 0 ? Number(cua[iK + 1]) : 0
if (iK >= 0 && !(khungMuon > 10 && khungMuon < 95)) {
  console.error('--khung nhận một số phần trăm trong khoảng 10–95')
  process.exit(1)
}

// ---------------------------------------------------------------- xếp hạng

const { w, h, rgb } = docPng(vao)
const n = w * h
console.log(`\nVÀO   ${vao}   ${w} × ${h}`)

const hang = new Uint8Array(n)
const mauTruoc = new Set()
for (let i = 0; i < n; i++) {
  const r = rgb[i * 3],
    g = rgb[i * 3 + 1],
    b = rgb[i * 3 + 2]
  mauTruoc.add((r << 16) | (g << 8) | b)
  let tot = Infinity,
    k = 0
  for (let j = 0; j < BANG.length; j++) {
    const d = (r - BANG[j][1]) ** 2 + (g - BANG[j][2]) ** 2 + (b - BANG[j][3]) ** 2
    if (d < tot) {
      tot = d
      k = j
    }
  }
  hang[i] = k
}

// --------------------------------------------- ép pixel nằm trong lòng mảng

const canDay = (2 * O + 1) ** 2
const moi = new Uint8Array(n * 3)
const daEp = new Uint8Array(n)
let epSo = 0

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * w + x
    const k = hang[i]
    let cung = 0,
      tong = 0
    for (let dy = -O; dy <= O; dy++) {
      const yy = y + dy
      if (yy < 0 || yy >= h) continue
      for (let dx = -O; dx <= O; dx++) {
        const xx = x + dx
        if (xx < 0 || xx >= w) continue
        tong++
        if (hang[yy * w + xx] === k) cung++
      }
    }
    // Sát mép ảnh cửa sổ bị cắt, nên so theo tỉ lệ chứ không theo số tuyệt đối.
    const can = tong === canDay ? Math.ceil(canDay * DAC) : Math.ceil(tong * DAC)
    if (cung >= can) {
      moi[i * 3] = BANG[k][1]
      moi[i * 3 + 1] = BANG[k][2]
      moi[i * 3 + 2] = BANG[k][3]
      daEp[i] = 1
      epSo++
    } else {
      moi[i * 3] = rgb[i * 3]
      moi[i * 3 + 1] = rgb[i * 3 + 1]
      moi[i * 3 + 2] = rgb[i * 3 + 2]
    }
  }
}

console.log('\nÉP MÀU')
console.log(`  ${mauTruoc.size.toLocaleString('vi')} màu khác nhau trước khi dọn`)
console.log(
  `  ép ${((epSo / n) * 100).toFixed(1)}% pixel về màu chuẩn · ` +
    `giữ ${(((n - epSo) / n) * 100).toFixed(1)}% ở ranh giới (khử răng cưa)`,
)

// ------------------------------------------------------- góc dưới phải đổi gì

{
  const o = Math.round(Math.min(w, h) * 0.17)
  let doi = 0
  for (let y = h - o; y < h; y++)
    for (let x = w - o; x < w; x++) {
      const i = y * w + x
      if (
        moi[i * 3] !== rgb[i * 3] ||
        moi[i * 3 + 1] !== rgb[i * 3 + 1] ||
        moi[i * 3 + 2] !== rgb[i * 3 + 2]
      )
        doi++
    }
  if (doi > o * o * 0.02)
    console.log(
      `\n  góc dưới phải: ${doi.toLocaleString('vi')} pixel đổi màu — dấu watermark của ` +
        'máy sinh ảnh nằm trong đó và đã bị ép thành nền',
    )
}

// ---------------------------------------------------------------- cắt khung

let W = w,
  H = h,
  cuoi = moi
if (khungMuon) {
  const [gr, gg, gb] = [BANG[K_GIAY][1], BANG[K_GIAY][2], BANG[K_GIAY][3]]
  let x0 = w,
    y0 = h,
    x1 = -1,
    y1 = -1
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3
      if (moi[i] === gr && moi[i + 1] === gg && moi[i + 2] === gb) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }

  const caoND = y1 - y0 + 1,
    rongND = x1 - x0 + 1
  const Hm = Math.round(caoND / (khungMuon / 100))
  const Wm = Math.max(Math.round(rongND / 0.84), Math.round((Hm * w) / h))
  if (Hm >= h && Wm >= w) {
    console.log(
      `\nCẮT KHUNG  bỏ qua — nội dung đã chiếm ${((caoND / h) * 100).toFixed(1)}%, cắt nữa thì chạm mép`,
    )
  } else {
    const H2 = Math.min(h, Hm),
      W2 = Math.min(w, Wm)
    const cx = Math.max(0, Math.min(w - W2, Math.round((x0 + x1) / 2 - W2 / 2)))
    const cy = Math.max(0, Math.min(h - H2, Math.round((y0 + y1) / 2 - H2 / 2)))
    const cat = new Uint8Array(W2 * H2 * 3)
    for (let y = 0; y < H2; y++)
      for (let x = 0; x < W2; x++) {
        const s = ((cy + y) * w + (cx + x)) * 3,
          d = (y * W2 + x) * 3
        cat[d] = moi[s]
        cat[d + 1] = moi[s + 1]
        cat[d + 2] = moi[s + 2]
      }
    console.log(
      `\nCẮT KHUNG  ${w}×${h} → ${W2}×${H2}, nội dung chiếm ` +
        `${((caoND / h) * 100).toFixed(1)}% → ${((caoND / H2) * 100).toFixed(1)}% chiều cao`,
    )
    W = W2
    H = H2
    cuoi = cat
  }
}

// ---------------------------------------------------------------- kiểm lại

ghiPng(ra, W, H, cuoi)

{
  const { w: w2, h: h2, rgb: r2 } = docPng(ra)
  const dem = new Map()
  for (let i = 0, m = w2 * h2; i < m; i++) {
    const k = (r2[i * 3] << 16) | (r2[i * 3 + 1] << 8) | r2[i * 3 + 2]
    dem.set(k, (dem.get(k) || 0) + 1)
  }
  const chuan = new Set(BANG.map(([, r, g, b]) => (r << 16) | (g << 8) | b))
  let trongBang = 0
  for (const [k, c] of dem) if (chuan.has(k)) trongBang += c
  console.log(`\nRA    ${ra}   ${w2} × ${h2}`)
  console.log(
    `  ${dem.size.toLocaleString('vi')} màu khác nhau · ` +
      `${((trongBang / (w2 * h2)) * 100).toFixed(1)}% pixel nằm đúng trong chín màu chuẩn`,
  )
  for (const [ten, r, g, b] of BANG) {
    const c = dem.get((r << 16) | (g << 8) | b) || 0
    console.log(
      `    ${hex(r, g, b)}  ${ten.padEnd(10)} ${((c / (w2 * h2)) * 100).toFixed(2).padStart(6)}%`,
    )
  }
  console.log(`\n  Soi lại bằng: node scripts/do-linh-vat.mjs ${ra}\n`)
}
