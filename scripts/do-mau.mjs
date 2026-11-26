#!/usr/bin/env node
// Kiểm mọi cặp màu trong hệ style có đạt tương phản không.
//
// Lý do tồn tại: luật số 9 — đo, đừng chốt bằng mắt. Vòng trước chốt bằng mắt,
// tới lúc đo thì bảy token trượt 4.5:1.
//
// Đổi bất cứ token màu nào trong src/styles/index.css thì sửa bảng dưới đây
// cho khớp rồi chạy lại. Trượt thì nó thoát với mã 1.
//
//   node scripts/do-mau.mjs

// ---------------------------------------------------------------- bảng token
// Giữ khớp với block @theme trong src/styles/index.css.
const MAU = {
  nen: '#ffffff',
  chu: '#18181b',
  'chu-phu': '#52525b',
  ke: '#e6e6e2',

  // nền khối, pha từ màu linh vật cho tới khi nổi bằng nhau trên trắng
  'lam-thu': '#f6f7fc',
  'tu-kiem': '#edfaf5',
  'ghi-lai': '#fcf5f6',

  // màu ngữ nghĩa — bộ riêng, không lấy từ linh vật
  dung: '#15803d',
  sai: '#b91c1c',
  'han-lam': '#4338ca',

  // màu linh vật — CHỈ dùng làm nền tô hoặc chấm, không bao giờ làm màu chữ
  nao: '#9097de',
  'nao-vien': '#5f66ac',
  tim: '#d46b76',
  'tim-vien': '#8f404a',
  'bac-ha': '#9be5c5',
  muc: '#0b0b12',
}

// Cặp nào phải đạt bao nhiêu. 4.5 cho chữ thường, 3.0 cho chữ to và cho
// đường viền / hình khối mang nghĩa.
const CAN = [
  // chữ trên nền trắng
  ['chu', 'nen', 4.5, 'chữ thường'],
  ['chu-phu', 'nen', 4.5, 'chữ phụ'],
  ['dung', 'nen', 4.5, 'nhãn "đúng"'],
  ['sai', 'nen', 4.5, 'nhãn "sai"'],
  ['han-lam', 'nen', 4.5, 'nhãn hàn lâm'],

  // chữ trong khối có tô — nền nhạt nên khó hơn một chút
  ['chu', 'lam-thu', 4.5, 'chữ trong khối Làm thử'],
  ['chu-phu', 'lam-thu', 4.5, 'chữ phụ trong khối Làm thử'],
  ['chu', 'tu-kiem', 4.5, 'chữ trong khối Tự kiểm'],
  ['chu-phu', 'tu-kiem', 4.5, 'chữ phụ trong khối Tự kiểm'],
  ['chu', 'ghi-lai', 4.5, 'chữ trong khối Ghi lại'],
  ['chu-phu', 'ghi-lai', 4.5, 'chữ phụ trong khối Ghi lại'],

  // mực trên nền màu linh vật — nút, nhãn, chấm
  ['muc', 'nao', 4.5, 'mực trên tím Não'],
  ['muc', 'tim', 4.5, 'mực trên đỏ Tim'],
  ['muc', 'bac-ha', 4.5, 'mực trên bạc hà'],

  // viền thân linh vật phải tách khỏi nền trắng đủ để thấy
  ['nao-vien', 'nen', 3.0, 'viền thân Não trên trắng'],
  ['tim-vien', 'nen', 3.0, 'viền thân Tim trên trắng'],

  // đường kẻ giao diện: chỉ cần thấy, không cần đọc
  ['ke', 'nen', 1.2, 'đường kẻ'],
]

// Ba màu này KHÔNG được làm màu chữ. Script kiểm ngược: nếu chúng vô tình đạt
// 4.5:1 trên trắng thì luật "chỉ làm màu tô" mất lý do, phải xem lại.
const CHI_LAM_NEN = ['nao', 'tim', 'bac-ha']

// ------------------------------------------------------------------- tính toán
function sang(hex) {
  const c = hex
    .replace('#', '')
    .match(/../g)
    .map((v) => {
      const s = parseInt(v, 16) / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const tuongPhan = (a, b) => {
  const x = sang(a),
    y = sang(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

// ------------------------------------------------------------------------ chạy
let truot = 0
console.log('\nTƯƠNG PHẢN TỪNG CẶP\n')
for (const [a, b, can, nhan] of CAN) {
  if (!MAU[a] || !MAU[b]) {
    console.log(`  ⚠ thiếu token: ${!MAU[a] ? a : b}`)
    truot++
    continue
  }
  const t = tuongPhan(MAU[a], MAU[b])
  const dat = t >= can
  if (!dat) truot++
  console.log(
    `  ${dat ? '✓' : '✗'} ${nhan.padEnd(30)} ${t.toFixed(2).padStart(6)}:1` +
      `  (cần ${can})  ${MAU[a]} trên ${MAU[b]}`,
  )
}

console.log('\nBA MÀU CHỈ ĐƯỢC LÀM NỀN TÔ — kiểm rằng chúng thật sự không làm được màu chữ\n')
for (const t of CHI_LAM_NEN) {
  const v = tuongPhan(MAU[t], MAU.nen)
  const dungNhu = v < 4.5
  if (!dungNhu) truot++
  console.log(
    `  ${dungNhu ? '✓' : '✗'} ${t.padEnd(30)} ${v.toFixed(2).padStart(6)}:1 trên trắng` +
      `  ${dungNhu ? '— đúng như luật, không dùng làm chữ được' : '— LẠ: giờ nó đạt, xem lại luật'}`,
  )
}

console.log(
  '\nBA NỀN KHỐI CÓ NỔI BẰNG NHAU KHÔNG — lệch nhiều thì khối này đập vào mắt hơn khối kia\n',
)
const noi = ['lam-thu', 'tu-kiem', 'ghi-lai'].map((t) => [t, tuongPhan(MAU[t], MAU.nen)])
const tb = noi.reduce((s, [, v]) => s + v, 0) / noi.length
for (const [t, v] of noi) {
  const lech = (Math.abs(v - tb) / (tb - 1)) * 100
  const ok = lech <= 12
  if (!ok) truot++
  console.log(
    `  ${ok ? '✓' : '✗'} ${t.padEnd(30)} nổi ${v.toFixed(3)}  lệch ${lech.toFixed(1)}% khỏi trung bình`,
  )
}

console.log(truot ? `\n${truot} chỗ trượt.\n` : '\nTất cả đạt.\n')
process.exit(truot ? 1 : 0)
