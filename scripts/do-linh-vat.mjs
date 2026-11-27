#!/usr/bin/env node
// Đo một ảnh linh vật so với bảng tỉ lệ trong docs/linh-vat/LINH-VAT.md.
//
// Lý do tồn tại: luật số 9 của dự án — "đo, đừng chốt bằng mắt". Vòng trước
// chốt màu bằng mắt, tới lúc đo thì bảy token trượt.
//
// Không phụ thuộc thư viện nào: giải mã PNG bằng scripts/anh-png.mjs.
//
//   node scripts/do-linh-vat.mjs <anh.png>

import { docPng } from './anh-png.mjs'

// ------------------------------------------------------------------ tiện ích

const BANG_MAU = [
  ['nao', 0x90, 0x97, 0xde],
  ['tim', 0xd4, 0x6b, 0x76],
  ['bac-ha', 0x9b, 0xe5, 0xc5],
  ['muc', 0x0b, 0x0b, 0x12],
  ['trang', 0xff, 0xff, 0xff],
  ['giay', 0xf5, 0xf4, 0xe9],
  ['bong', 0xe0, 0xd8, 0xc8],
]

const hex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

function ganNhat(r, g, b) {
  let ten = null,
    tot = Infinity
  for (const [t, pr, pg, pb] of BANG_MAU) {
    const d = Math.hypot(r - pr, g - pg, b - pb)
    if (d < tot) {
      tot = d
      ten = t
    }
  }
  return { ten, khoangCach: tot }
}

function hopBao(w, h, hop) {
  let x0 = w,
    y0 = h,
    x1 = -1,
    y1 = -1,
    dem = 0
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (hop(x, y)) {
        dem++
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
  return dem ? { x0, y0, x1, y1, rong: x1 - x0 + 1, cao: y1 - y0 + 1, dem } : null
}

// tìm các mảng liền nhau thoả điều kiện, bỏ mảng nhỏ hơn toiThieu pixel
function timMang(w, h, thoa, toiThieu) {
  const daXet = new Uint8Array(w * h)
  const mang = []
  const ngan = new Int32Array(w * h)
  for (let s = 0; s < w * h; s++) {
    if (daXet[s] || !thoa(s % w, (s / w) | 0)) continue
    let dinh = 0
    ngan[dinh++] = s
    daXet[s] = 1
    let x0 = w,
      y0 = h,
      x1 = -1,
      y1 = -1,
      dem = 0
    while (dinh) {
      const p = ngan[--dinh]
      const px = p % w,
        py = (p / w) | 0
      dem++
      if (px < x0) x0 = px
      if (px > x1) x1 = px
      if (py < y0) y0 = py
      if (py > y1) y1 = py
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = px + dx,
          ny = py + dy
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
        const q = ny * w + nx
        if (daXet[q] || !thoa(nx, ny)) continue
        daXet[q] = 1
        ngan[dinh++] = q
      }
    }
    if (dem >= toiThieu)
      mang.push({
        x0,
        y0,
        x1,
        y1,
        rong: x1 - x0 + 1,
        cao: y1 - y0 + 1,
        dem,
        cx: (x0 + x1) / 2,
        cy: (y0 + y1) / 2,
      })
  }
  return mang.sort((a, b) => b.dem - a.dem)
}

// ----------------------------------------------------------------------- đo

const duongDan = process.argv[2]
if (!duongDan) {
  console.error('Thiếu đường dẫn ảnh.\n  node scripts/do-linh-vat.mjs <anh.png>')
  process.exit(1)
}

const { w, h, rgb } = docPng(duongDan)
const tai = (x, y) => {
  const i = (y * w + x) * 3
  return [rgb[i], rgb[i + 1], rgb[i + 2]]
}

console.log(`\nẢNH  ${duongDan}`)
console.log(`Kích thước  ${w} × ${h}${w === h ? ' (vuông)' : '  ⚠ KHÔNG VUÔNG'}`)
if (w < 1536) console.log(`  ⚠ Dưới mức tối thiểu 1536 mà hợp đồng đòi`)

// --- nền
const [nr, ng, nb] = tai(4, 4)
const nen = ganNhat(nr, ng, nb)
console.log(`\nNỀN  ${hex(nr, ng, nb)}  → gần "${nen.ten}" nhất, lệch ${nen.khoangCach.toFixed(1)}`)
if (nen.ten !== 'giay') console.log(`  ⚠ Nền phải là giấy #F5F4E9`)
else if (nen.khoangCach > 12) console.log(`  ⚠ Lệch khỏi #F5F4E9 hơi nhiều`)

// --- bảng màu
const demMau = new Map()
const demNhom = new Map()
let ngoaiBang = 0
for (let i = 0, n = w * h; i < n; i++) {
  const r = rgb[i * 3],
    g = rgb[i * 3 + 1],
    b = rgb[i * 3 + 2]
  const k = (r << 16) | (g << 8) | b
  demMau.set(k, (demMau.get(k) || 0) + 1)
  const { ten, khoangCach } = ganNhat(r, g, b)
  demNhom.set(ten, (demNhom.get(ten) || 0) + 1)
  if (khoangCach > 40) ngoaiBang++
}
const tong = w * h
console.log(`\nMÀU  ${demMau.size.toLocaleString('vi')} màu khác nhau`)
console.log(`Ngoài bảng (lệch > 40 khỏi mọi màu chuẩn): ${((ngoaiBang / tong) * 100).toFixed(2)}%`)
console.log('\n15 màu nhiều pixel nhất:')
;[...demMau.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([k, c], i) => {
    const r = k >> 16,
      g = (k >> 8) & 255,
      b = k & 255
    const { ten, khoangCach } = ganNhat(r, g, b)
    const co = ((c / tong) * 100).toFixed(2).padStart(6)
    const canh =
      khoangCach < 6 ? '= ' + ten : `lệch ${khoangCach.toFixed(0).padStart(3)} khỏi ${ten}`
    console.log(`  ${String(i + 1).padStart(2)}. ${hex(r, g, b)}  ${co}%   ${canh}`)
  })

// --- watermark: tìm trước, vì nó làm hỏng mọi phép đo khác
const laNen = (x, y) => {
  const [r, g, b] = tai(x, y)
  return Math.hypot(r - nr, g - ng, b - nb) < 14
}
// Ngưỡng phải NHẠY: watermark của máy sinh ảnh chỉ lệch nền vài mức sáng.
// Ngưỡng 14 từng báo "sạch" cho một ảnh vẫn còn dấu, lệch có 8 mức.
const o = Math.round(Math.min(w, h) * 0.17)
const goc = hopBao(w, h, (x, y) => {
  if (x < w - o || y < h - o) return false
  const [r, g, b] = tai(x, y)
  return Math.hypot(r - nr, g - ng, b - nb) > 5
})
console.log(`\nGÓC DƯỚI PHẢI  ô ${o}×${o}px, ngưỡng lệch 5 mức sáng:`)
if (!goc) console.log('  sạch')
else
  console.log(
    `  ⚠ CÓ ${goc.dem} pixel khác nền, ở x ${goc.x0}–${goc.x1}, y ${goc.y0}–${goc.y1}` +
      `  (${goc.rong}×${goc.cao}) — nhiều khả năng là watermark`,
  )
const trongGoc = (x, y) =>
  goc && x >= goc.x0 - 4 && x <= goc.x1 + 4 && y >= goc.y0 - 4 && y <= goc.y1 + 4

// --- khung hình, bỏ watermark ra
const noiDung = hopBao(w, h, (x, y) => !laNen(x, y) && !trongGoc(x, y))
if (noiDung) {
  const tyLe = (noiDung.cao / h) * 100
  console.log(
    `\nKHUNG  nhân vật cao ${noiDung.cao}px = ${tyLe.toFixed(1)}% khung  (hợp đồng: ~70%)`,
  )
  const le = [noiDung.y0, h - 1 - noiDung.y1, noiDung.x0, w - 1 - noiDung.x1]
  console.log(
    `Lề  trên ${le[0]} · dưới ${le[1]} · trái ${le[2]} · phải ${le[3]}  (tối thiểu ${Math.round(h * 0.08)}px = 8%)`,
  )
  if (Math.min(...le) < h * 0.08) console.log(`  ⚠ Có cạnh lề mỏng hơn 8%`)
  if (tyLe < 62) console.log(`  ⚠ Nhân vật nhỏ hơn hẳn mức 70% — phí mất độ phân giải`)
}

// --- thân hai nhân vật: lấy mảng liền lớn nhất của mỗi màu, không lấy hộp bao toàn ảnh
const thuocVe = (ten, nguong) => (x, y) => {
  const [r, g, b] = tai(x, y)
  const k = ganNhat(r, g, b)
  return k.ten === ten && k.khoangCach < nguong
}
const thanNao = timMang(w, h, thuocVe('nao', 60), 5000)[0]
const thanTim = timMang(w, h, thuocVe('tim', 60), 5000)[0]

// màu trong thân có bệt không, hay đang đổ bóng
function doBet(nhan, than, ten) {
  if (!than) return
  const dem = new Map()
  let tong = 0
  for (let y = than.y0; y <= than.y1; y++)
    for (let x = than.x0; x <= than.x1; x++) {
      const [r, g, b] = tai(x, y)
      if (ganNhat(r, g, b).ten !== ten) continue
      dem.set((r << 16) | (g << 8) | b, (dem.get((r << 16) | (g << 8) | b) || 0) + 1)
      tong++
    }
  const top = [...dem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  const troi = (top[0][1] / tong) * 100
  console.log(
    `${nhan} — màu thân: ${dem.size.toLocaleString('vi')} sắc độ, đậm nhất ${troi.toFixed(1)}%`,
  )
  console.log(
    `   ${top.map(([k, c]) => `${hex(k >> 16, (k >> 8) & 255, k & 255)} ${((c / tong) * 100).toFixed(1)}%`).join(' · ')}`,
  )
  if (troi < 55)
    console.log(`   ⚠ Không bệt — màu bị tãi ra nhiều sắc độ, dấu hiệu đổ bóng hoặc nhiễu`)
}

console.log('\nTHÂN')
if (thanNao)
  console.log(
    `Não  cao ${thanNao.cao}  rộng ${thanNao.rong}   (x ${thanNao.x0}–${thanNao.x1}, y ${thanNao.y0}–${thanNao.y1})`,
  )
if (thanTim)
  console.log(
    `Tim  cao ${thanTim.cao}  rộng ${thanTim.rong}   (x ${thanTim.x0}–${thanTim.x1}, y ${thanTim.y0}–${thanTim.y1})`,
  )
if (thanNao && thanTim) {
  const tl = thanTim.cao / thanNao.cao
  const dat = Math.abs(tl - 0.93) <= 0.04
  console.log(
    `Tim / Não = ${(tl * 100).toFixed(1)}%   (chuẩn 93%, chấp nhận 89–97%)  ${dat ? 'ĐẠT' : '⚠ TRƯỢT'}`,
  )
}
doBet('Não', thanNao, 'nao')
doBet('Tim', thanTim, 'tim')

// --- viền thân: phải ám màu, không được là mực
// Đi từ mép thân ra ngoài, nhặt pixel sẫm nhất. Dưới độ sáng 40 là mực — sai.
function doVien(nhan, than, chuan, dayChuan) {
  if (!than) return
  const sang = [],
    mau = new Map(),
    xa = Math.max(4, Math.round(than.cao * 0.06))
  let boQua = 0
  const laThan = (x, y) => {
    const [r, g, b] = tai(x, y)
    const k = ganNhat(r, g, b)
    return (k.ten === 'nao' || k.ten === 'tim') && k.khoangCach < 60
  }
  for (let y = than.y0 + Math.round(than.cao * 0.12); y < than.y1 - than.cao * 0.12; y += 3) {
    for (const huong of [-1, 1]) {
      // tìm mép thân trên dòng này
      let mep = -1
      if (huong < 0) {
        for (let x = than.x0 - xa; x <= than.x1; x++)
          if (x >= 0 && laThan(x, y)) {
            mep = x
            break
          }
      } else {
        for (let x = Math.min(w - 1, than.x1 + xa); x >= than.x0; x--)
          if (laThan(x, y)) {
            mep = x
            break
          }
      }
      if (mep < 0) continue
      // huong = -1 là mép TRÁI, ra ngoài thân là GIẢM x; +1 là mép phải, ra
      // ngoài là tăng x. Bản đầu viết nhầm dấu nên quét ngược vào trong thân,
      // chỉ bắt được viền nhờ vài pixel ở rìa.
      // Và phụ kiện cũng viền mực, cũng nằm sát mép thân — dòng nào chạm phụ
      // kiện thì bỏ, không thì thước đọc viền đen của chụp tai rồi kết tội
      // thân là viền mực. Đã vấp thật ở ảnh vòng 4.
      let toiNhat = null,
        toiL = 999,
        chamPhuKien = false
      for (let d = 0; d <= xa; d++) {
        const x = mep + huong * d
        if (x < 0 || x >= w) continue
        const [r, g, b] = tai(x, y)
        if (ganNhat(r, g, b).ten === 'bac-ha') {
          chamPhuKien = true
          break
        }
        const l = 0.299 * r + 0.587 * g + 0.114 * b
        if (l < toiL) {
          toiL = l
          toiNhat = hex(r, g, b)
        }
      }
      if (chamPhuKien) {
        boQua++
        continue
      }
      if (toiNhat && toiL < 200) {
        sang.push(toiL)
        mau.set(toiNhat, (mau.get(toiNhat) || 0) + 1)
      }
    }
  }
  if (!sang.length) return console.log(`${nhan} — không đọc được viền`)
  sang.sort((a, b) => a - b)
  const tv = sang[sang.length >> 1]
  const top = [...mau.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  // Mực thì xám và tối. Ám màu thì tối nhưng CÓ màu — phân biệt bằng độ bão hoà,
  // nếu chỉ nhìn độ sáng thì một viền đỏ rất sẫm bị kết tội oan là mực.
  const [r0, g0, b0] = top[0][0]
    .slice(1)
    .match(/../g)
    .map((v) => parseInt(v, 16))
  const bao = Math.max(r0, g0, b0) - Math.min(r0, g0, b0)
  let ket
  if (bao < 25) ket = '⚠ TRƯỢT — xám và tối, tức là MỰC ĐEN chứ không phải ám màu'
  else if (tv > 140) ket = '⚠ TRƯỢT — quá nhạt, gần như không có viền'
  else if (tv < 72)
    ket = `~ SÁT — đúng họ màu nhưng sẫm quá (${tv.toFixed(0)} so với ~89 của ${chuan})`
  else ket = 'ĐẠT — ám màu'
  console.log(
    `${nhan} — viền thân: độ sáng trung vị ${tv.toFixed(0)}, bão hoà ${bao}  ${top.map(([k, n]) => `${k}×${n}`).join(' · ')}`,
  )
  if (boQua)
    console.log(`   (bỏ ${boQua} lát cắt chạm phụ kiện — chúng viền mực, không phải viền thân)`)
  console.log(`   chuẩn ${chuan} · ${ket}`)
}
// Trên ảnh ĐÃ DỌN, mọi mảng đều là màu chuẩn nên đếm được chính xác: đi vòng
// quanh MÉP NGOÀI của thân, nhìn ra ngoài vài pixel, xem gặp màu viền ám hay
// gặp mực. Luật là thân không bao giờ viền mực, nên tỉ lệ mực ở đây là tỉ lệ sai.
//
// "Mép ngoài" là chỗ dễ sai nhất của phép đo này. Bản đầu đếm mọi ranh giới
// thân-với-không-phải-thân, nên kính nằm lọt trong mặt Não cũng bị tính là
// "thân viền mực", và nó báo Não lẫn 55% mực trong khi viền Não vốn đúng.
// Giờ loang từ biên ảnh qua mọi pixel không phải thân: cái gì tới được mới là
// mép ngoài. Kính không tới được nên không tính.
function doTinhKhiet(nhan, than, vien) {
  if (!than) return
  const THAN_NAO = [0x90, 0x97, 0xde],
    THAN_TIM = [0xd4, 0x6b, 0x76]
  const MUC = [0x0b, 0x0b, 0x12],
    BH = [0x9b, 0xe5, 0xc5]
  const bang = (x, y, c) => {
    const i = (y * w + x) * 3
    return rgb[i] === c[0] && rgb[i + 1] === c[1] && rgb[i + 2] === c[2]
  }
  const laThanBatKy = (x, y) => bang(x, y, THAN_NAO) || bang(x, y, THAN_TIM)

  // loang từ biên ảnh, không đi qua pixel thân
  const ngoai = new Uint8Array(w * h)
  const ngan = new Int32Array(w * h)
  let dinh = 0
  const day = (x, y) => {
    const i = y * w + x
    if (ngoai[i] || laThanBatKy(x, y)) return
    ngoai[i] = 1
    ngan[dinh++] = i
  }
  for (let x = 0; x < w; x++) {
    day(x, 0)
    day(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    day(0, y)
    day(w - 1, y)
  }
  while (dinh) {
    const q = ngan[--dinh],
      qx = q % w,
      qy = (q / w) | 0
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = qx + dx,
        ny = qy + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      day(nx, ny)
    }
  }

  const THAN = nhan === 'Tim' ? THAN_TIM : THAN_NAO
  let am = 0,
    muc = 0,
    bh = 0,
    khac = 0
  for (let y = Math.max(1, than.y0); y <= Math.min(h - 2, than.y1); y++) {
    for (let x = Math.max(1, than.x0); x <= Math.min(w - 2, than.x1); x++) {
      if (!bang(x, y, THAN)) continue
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (bang(x + dx, y + dy, THAN)) continue
        if (!ngoai[(y + dy) * w + (x + dx)]) continue // ranh giới bên trong: bỏ
        let thay = null
        for (let d = 1; d <= 6; d++) {
          const nx = x + dx * d,
            ny = y + dy * d
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) break
          if (bang(nx, ny, vien)) {
            thay = 'am'
            break
          }
          if (bang(nx, ny, MUC)) {
            thay = 'muc'
            break
          }
          if (bang(nx, ny, BH)) {
            thay = 'bh'
            break
          }
        }
        if (thay === 'am') am++
        else if (thay === 'muc') muc++
        else if (thay === 'bh') bh++
        else khac++
        break
      }
    }
  }
  const tinh = am + muc
  if (!tinh) return console.log(`${nhan} — không đọc được mép ngoài`)
  const ti = (am / tinh) * 100
  console.log(
    `${nhan} — độ tinh khiết viền: ${ti.toFixed(0)}% ám màu, ${(100 - ti).toFixed(0)}% mực` +
      `   ${ti >= 90 ? 'ĐẠT' : ti >= 70 ? '~ còn lẫn mực' : '⚠ lẫn mực nhiều'}`,
  )
  console.log(
    `   ${tinh.toLocaleString('vi')} điểm mép ngoài · ${bh.toLocaleString('vi')} chạm phụ kiện · ` +
      `${khac.toLocaleString('vi')} không đọc được, cả ba không tính vào tỉ lệ`,
  )
}

console.log('\nVIỀN THÂN  (phải ám màu, không được là mực)')
doVien('Não', thanNao, '#5F66AC', 0.19)
doVien('Tim', thanTim, '#8F404A', 0.26)

// Chỉ chạy được trên ảnh đã dọn — ảnh thô thì không có màu nào đúng tuyệt đối.
console.log('\nĐỘ TINH KHIẾT VIỀN  (chỉ có nghĩa với ảnh đã qua don-anh-linh-vat.mjs)')
doTinhKhiet('Não', thanNao, [0x5f, 0x66, 0xac])
doTinhKhiet('Tim', thanTim, [0x8f, 0x40, 0x4a])

// --- khe hở: phải có một dải cột toàn nền chạy suốt từ đỉnh xuống đáy.
// Hai nhân vật chạm nhau thì sau này tách nền từng con sẽ vướng.
if (thanNao && thanTim) {
  const sach = (x) => {
    for (let y = 0; y < h; y++) {
      const [r, g, b] = tai(x, y)
      if (Math.hypot(r - nr, g - ng, b - nb) > 10) return false
    }
    return true
  }
  let rong = 0,
    dau = -1,
    chay = 0,
    batDau = -1
  const tu = Math.min(thanNao.x1, thanTim.x1),
    den = Math.max(thanNao.x0, thanTim.x0)
  for (let x = tu; x <= den; x++) {
    if (sach(x)) {
      if (!chay) batDau = x
      chay++
      if (chay > rong) {
        rong = chay
        dau = batDau
      }
    } else chay = 0
  }
  console.log('\nKHE GIỮA HAI NHÂN VẬT')
  if (!rong) {
    console.log(
      '  ⚠ TRƯỢT — không có cột nào toàn nền giữa hai con: chúng đang chạm hoặc chồng nhau',
    )
  } else {
    const theo = (rong / thanTim.cao) * 100
    console.log(
      `  dải nền trống rộng ${rong}px (x ${dau}–${dau + rong - 1}) = ${theo.toFixed(0)}% chiều cao thân Tim`,
    )
    console.log(`  ${theo >= 20 ? 'ĐẠT — tách rời, tách nền từng con được' : '⚠ hơi sát'}`)
  }
}

// --- mắt: các mảng trắng, trừ watermark ra
const laTrang = (x, y) => {
  const [r, g, b] = tai(x, y)
  return r > 235 && g > 235 && b > 238 // b cao để loại nền giấy (b=233)
}
const trang = timMang(w, h, (x, y) => laTrang(x, y) && !trongGoc(x, y), 500).slice(0, 6)
console.log(`\nMẮT  tìm được ${trang.length} mảng trắng đủ lớn (đã trừ watermark)`)
trang.forEach((m, i) => {
  const d = (m.rong + m.cao) / 2
  console.log(
    `  ${i + 1}. tâm (${m.cx.toFixed(0)}, ${m.cy.toFixed(0)})  ${m.rong}×${m.cao}  đường kính ~${d.toFixed(0)}`,
  )
})

const dk = (l) => l.reduce((s, m) => s + (m.rong + m.cao) / 2, 0) / (l.length || 1)

// Ảnh đôi thì chia trái/phải; ảnh một nhân vật thì cả bốn mảng đều của nó.
const doi = !!(thanNao && thanTim)
let ben, phai
if (doi) {
  const giua = (thanNao.x1 + thanTim.x0) / 2
  // Giữ đúng hai mảng to nhất mỗi bên. Ở ảnh phân giải cao, đốm sáng trong con
  // ngươi cũng đủ to để lọt ngưỡng, và nó kéo cỡ mắt trung bình xuống còn nửa.
  const hai = (l) =>
    l
      .sort((a, b) => b.dem - a.dem)
      .slice(0, 2)
      .sort((a, b) => a.cx - b.cx)
  ben = hai(trang.filter((m) => m.cx < giua))
  phai = hai(trang.filter((m) => m.cx >= giua))
} else {
  ben = trang.slice(0, 2).sort((a, b) => a.cx - b.cx)
  phai = []
}

function khoangMat(nhan, mat, than) {
  if (!than) return
  const d = dk(mat)
  if (mat.length >= 2) {
    const cach = Math.abs(mat[1].cx - mat[0].cx)
    console.log(
      `${nhan}: mắt ~${d.toFixed(0)}px, hai mắt cách tâm-tâm ${cach.toFixed(0)}px = ` +
        `${(cach / d).toFixed(2)}× đường kính  (chuẩn 4.2/2.6 = 1.62)`,
    )
    const lech = Math.abs(mat[0].rong - mat[1].rong) / d
    if (lech > 0.08)
      console.log(`  ⚠ hai mắt của chính nó đã lệch nhau ${(lech * 100).toFixed(0)}%`)
  }
  // 2.6 là tính theo thân Não. Thân Tim cao 9.3 nên cùng cỡ mắt sẽ ra 2.6 × 10/9.3 = 2.80.
  const mong = nhan === 'Tim' ? (2.6 * 10) / 9.3 : 2.6
  const dv = (d / than.cao) * 10
  console.log(
    `${nhan}: đường kính mắt = ${dv.toFixed(2)} đơn vị theo thân của chính nó  (chuẩn ${mong.toFixed(2)})` +
      `${Math.abs(dv - mong) <= 0.3 ? '  ĐẠT' : '  ⚠ TRƯỢT'}`,
  )
  const caoMat = ((than.y1 - mat[0].cy) / than.cao) * 100
  const mongMat = nhan === 'Tim' ? 57 : 52 // đo từ ảnh gốc, không phải số tự đặt
  console.log(
    `${nhan}: tâm mắt ở ${caoMat.toFixed(0)}% chiều cao thân tính từ đáy  (chuẩn ${mongMat}%)` +
      `${Math.abs(caoMat - mongMat) <= 5 ? '  ĐẠT' : '  ⚠ TRƯỢT'}`,
  )
}

if (doi && ben.length && phai.length) {
  const a = dk(ben),
    b = dk(phai)
  const tl = b / a
  const dat = Math.abs(tl - 1) <= 0.08
  console.log(
    `\nMắt Não ~${a.toFixed(0)}px · mắt Tim ~${b.toFixed(0)}px → Tim / Não = ${(tl * 100).toFixed(1)}%`,
  )
  console.log(`  chuẩn 100% (thân nhỏ hơn, mắt thì không)  ${dat ? 'ĐẠT' : '⚠ TRƯỢT'}`)
  khoangMat('Não', ben, thanNao)
  khoangMat('Tim', phai, thanTim)
} else if (ben.length) {
  console.log(`\nẢnh một nhân vật — không so được hai con, đo theo đơn vị thân:`)
  khoangMat(thanNao ? 'Não' : 'Tim', ben, thanNao || thanTim)
  console.log(`  So cỡ mắt giữa hai ảnh đơn: cả hai phải ra cùng số px nếu cùng cỡ ảnh,`)
  console.log(`  và cùng ~2.6 đơn vị dù thân Tim nhỏ hơn.`)
}

// --- quét ngang qua tâm mắt Não: đọc kính
const laMuc = (x, y) => {
  const [r, g, b] = tai(x, y)
  return ganNhat(r, g, b).ten === 'muc' && r < 90
}
if (ben.length) {
  const y = Math.round(ben[0].cy)
  console.log(`\nKÍNH  quét ngang y=${y} qua tâm mắt trái của Não:`)
  const doan = []
  let dau = null,
    loai = null
  for (let x = 0; x < w; x++) {
    const l = laMuc(x, y) ? 'mực' : laTrang(x, y) ? 'trắng' : laNen(x, y) ? 'nền' : 'thân'
    if (l !== loai) {
      if (loai) doan.push([loai, dau, x - 1])
      loai = l
      dau = x
    }
  }
  if (loai) doan.push([loai, dau, w - 1])
  doan
    .filter(([l, a, b]) => b - a >= 2 && l !== 'nền')
    .forEach(([l, a, b]) => console.log(`    ${l.padEnd(6)} x ${a}–${b}   dày ${b - a + 1}`))
}

// --- nét viền thân: quét nhiều dòng, lấy trung vị bề dày nét ngoài cùng bên trái
function netVien(nhan, than) {
  if (!than) return
  const day = []
  for (let y = than.y0 + Math.round(than.cao * 0.15); y < than.y1 - than.cao * 0.15; y += 7) {
    let x = Math.max(0, than.x0 - 60),
      chay = 0
    for (; x < than.x1; x++) {
      if (laMuc(x, y)) chay++
      else if (chay >= 2) break
      else chay = 0
    }
    if (chay >= 2 && chay < than.cao * 0.2) day.push(chay)
  }
  if (!day.length) return console.log(`${nhan} — không đọc được nét viền`)
  day.sort((a, b) => a - b)
  const tv = day[day.length >> 1]
  console.log(
    `${nhan} — nét viền ~${tv}px = ${((tv / than.cao) * 10).toFixed(2)} đơn vị  (chuẩn ${nhan === 'Tim' ? '0.26' : '0.19'})` +
      `   [${day.length} lát cắt, ${day[0]}–${day[day.length - 1]}]`,
  )
}
console.log('\nNÉT VIỀN')
netVien('Não', thanNao)
netVien('Tim', thanTim)

console.log('')
