#!/usr/bin/env node
// Dọn một ảnh linh vật do AI sinh: ép về đúng bảng màu, làm bóng bệt lại,
// và đổi viền thân Tim từ mực sang màu ám nếu máy bôi đen.
//
// Vì sao cần: qua hai vòng prompt rất cụ thể, bốn lỗi không nhúc nhích —
// nhiễu, bóng mềm, viền Tim đen, khung hình. Ba lỗi đầu là tầng render,
// ép bằng chữ không ăn. Nhưng chúng deterministic, nên sửa bằng script được.
//
//   node scripts/don-anh-linh-vat.mjs <vao.png> [ra.png] [--cat] [--giu-vien-tim]
//
//   --cat            cắt khung cho nhân vật chiếm 70%. Mặc định KHÔNG cắt.
//   --giu-vien-tim   không đụng vào viền Tim.
//
// Ảnh .webp thì chuyển sang PNG trước:
//   powershell -NoProfile -Command "Add-Type -AssemblyName PresentationCore; ..."
//   (xem docs/linh-vat/sinh-anh-lan-dau.md)
//
// KHÔNG xoá watermark. Dấu ghi nguồn là của nơi sinh ra ảnh. Ảnh còn dấu thì
// cũng không dùng làm ảnh tham chiếu được — nó dạy máy đóng dấu vào góc.
// Cách đúng là sinh ở nơi không đóng dấu, không phải tẩy đi.

import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

// ------------------------------------------------------------- bảng màu chuẩn

const BANG_MAU = [
  ['thân Não', 0x90, 0x97, 0xde],
  ['viền Não', 0x5f, 0x66, 0xac],
  ['thân Tim', 0xd4, 0x6b, 0x76],
  ['viền Tim', 0x8f, 0x40, 0x4a],
  ['bạc hà',   0x9b, 0xe5, 0xc5],
  ['mực',      0x0b, 0x0b, 0x12],
  ['giấy',     0xf5, 0xf4, 0xe9],
  ['bóng',     0xe0, 0xd8, 0xc8],
  ['trắng',    0xff, 0xff, 0xff],
];
const I_VIEN_TIM = 3, I_THAN_TIM = 2, I_MUC = 5, I_BAC_HA = 4;

// ----------------------------------------------------------------- PNG vào/ra

function giaiMaPng(duongDan) {
  const buf = readFileSync(duongDan);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Không phải tệp PNG');
  let w = 0, h = 0, bitDepth = 0, colorType = 0, interlace = 0, plte = null;
  const idat = [];
  for (let i = 8; i + 8 <= buf.length; ) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString('ascii', i + 4, i + 8);
    const data = buf.subarray(i + 8, i + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'PLTE') plte = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    i += 12 + len;
  }
  if (bitDepth !== 8) throw new Error(`Chỉ đọc được bitDepth 8, tệp này ${bitDepth}`);
  if (interlace !== 0) throw new Error('Không đọc được ảnh interlace');
  const soKenh = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!soKenh) throw new Error(`colorType không đỡ được: ${colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * soKenh;
  const phang = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[pos++];
    const dong = raw.subarray(pos, pos + stride); pos += stride;
    const cur = phang.subarray(y * stride, (y + 1) * stride);
    const tren = y > 0 ? phang.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= soKenh ? cur[x - soKenh] : 0;
      const b = tren ? tren[x] : 0;
      const c = tren && x >= soKenh ? tren[x - soKenh] : 0;
      let v = dong[x];
      if (filter === 1) v = (v + a) & 255;
      else if (filter === 2) v = (v + b) & 255;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      } else if (filter !== 0) throw new Error(`filter không đỡ được: ${filter}`);
      cur[x] = v;
    }
  }
  const rgb = new Uint8Array(w * h * 3);
  for (let i = 0, n = w * h; i < n; i++) {
    let r, g, b;
    if (colorType === 2 || colorType === 6) {
      r = phang[i * soKenh]; g = phang[i * soKenh + 1]; b = phang[i * soKenh + 2];
    } else if (colorType === 0 || colorType === 4) {
      r = g = b = phang[i * soKenh];
    } else { const k = phang[i] * 3; r = plte[k]; g = plte[k + 1]; b = plte[k + 2]; }
    rgb[i * 3] = r; rgb[i * 3 + 1] = g; rgb[i * 3 + 2] = b;
  }
  return { w, h, rgb };
}

const bangCrc = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function maHoaPng(duongDan, w, h, rgb) {
  const crc = (b) => { let c = -1; for (const v of b) c = bangCrc[(c ^ v) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const stride = w * 3;
  const than = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    than[y * (stride + 1)] = 0;
    for (let x = 0; x < stride; x++) than[y * (stride + 1) + 1 + x] = rgb[y * stride + x];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  writeFileSync(duongDan, Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(than, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]));
}

// ---------------------------------------------------------------------- chạy

const docSo = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const vao = docSo[0];
const ra = docSo[1] || (vao || '').replace(/\.png$/i, '') + '-da-don.png';
const coCat = process.argv.includes('--cat');
const giuVienTim = process.argv.includes('--giu-vien-tim');

if (!vao) {
  console.error('Thiếu đường dẫn ảnh.\n  node scripts/don-anh-linh-vat.mjs <vao.png> [ra.png] [--cat] [--giu-vien-tim]');
  process.exit(1);
}

const { w, h, rgb } = giaiMaPng(vao);
const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
console.log(`\nVÀO   ${vao}  ${w}×${h}`);
{
  const d = new Set();
  for (let i = 0; i < w * h; i++) d.add((rgb[i * 3] << 16) | (rgb[i * 3 + 1] << 8) | rgb[i * 3 + 2]);
  console.log(`      ${d.size.toLocaleString('vi')} màu khác nhau`);
}

// --- 1. ép về bảng màu
//
// So màu theo SẮC, không theo khoảng cách RGB thuần. Lý do: máy hay thêm bóng,
// tức là một sắc độ tối hơn của chính màu đó. Đo bằng RGB thì bạc hà tối
// (#7BAA98) lại gần màu thân Não hơn là gần bạc hà — chụp tai bị ép thành tím.
// Tách sáng/tối (Y) khỏi sắc (Cb, Cr) rồi hạ trọng số Y thì bóng của một màu
// vẫn rơi về đúng màu gốc của nó.
const TRONG_SO_SANG = 0.6;
const ycc = (r, g, b) => {
  const Y = 0.299 * r + 0.587 * g + 0.114 * b;
  return [Y, 0.564 * (b - Y), 0.713 * (r - Y)];
};
const MAU_YCC = BANG_MAU.map(([, r, g, b]) => ycc(r, g, b));

const nhan = new Uint8Array(w * h);
for (let i = 0, n = w * h; i < n; i++) {
  const [Y, Cb, Cr] = ycc(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
  let tot = Infinity, k = 0;
  for (let j = 0; j < MAU_YCC.length; j++) {
    const [pY, pCb, pCr] = MAU_YCC[j];
    const d = ((Y - pY) * TRONG_SO_SANG) ** 2 + (Cb - pCb) ** 2 + (Cr - pCr) ** 2;
    if (d < tot) { tot = d; k = j; }
  }
  nhan[i] = k;
}
{
  const dem = new Array(BANG_MAU.length).fill(0);
  for (const k of nhan) dem[k]++;
  console.log('\n1 · ÉP VỀ BẢNG MÀU');
  BANG_MAU.forEach(([ten, r, g, b], j) =>
    console.log(`     ${hex(r, g, b)}  ${ten.padEnd(9)} ${(dem[j] / (w * h) * 100).toFixed(2).padStart(6)}%`));
}

// --- 2. viền thân Tim: mực → màu ám
if (!giuVienTim) {
  const banKinh = Math.max(4, Math.round(h * 0.014));
  // Phân biệt viền với tay chân: viền ÔM quanh thân nên bắn tia ra là trúng thân
  // ở nhiều hướng. Gốc chân chỉ trúng thân theo đúng một hướng — hướng nó cắm
  // vào. Lấy mốc 3 hướng thì giữ được viền mà không nhuộm đỏ gốc chân.
  const HUONG = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const doi = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (nhan[i] !== I_MUC) continue;
      let trungTim = 0, gapBacHa = false;
      for (const [dx, dy] of HUONG) {
        for (let t = 1; t <= banKinh; t++) {
          const nx = x + dx * t, ny = y + dy * t;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) break;
          const k = nhan[ny * w + nx];
          if (k === I_BAC_HA) { gapBacHa = true; break; }
          if (k === I_THAN_TIM) { trungTim++; break; }
        }
        if (gapBacHa) break;
      }
      if (trungTim >= 3 && !gapBacHa) doi.push(i);
    }
  for (const i of doi) nhan[i] = I_VIEN_TIM;
  console.log(`\n2 · VIỀN THÂN TIM  đổi ${doi.length.toLocaleString('vi')} pixel mực → ${hex(0x8f, 0x40, 0x4a)}`);
  console.log(`     bắn 8 tia dài ${banKinh}px; đổi khi trúng thân Tim ở ≥3 hướng và không giáp bạc hà`);
  console.log(`     (mốc 3 hướng là thứ tách viền khỏi gốc tay chân — chân chỉ trúng một hướng)`);
} else {
  console.log('\n2 · VIỀN THÂN TIM  bỏ qua (--giu-vien-tim)');
}

// --- 3. dựng lại ảnh, làm mềm 1px ở ranh giới để khỏi răng cưa
const out = new Uint8Array(w * h * 3);
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const i = y * w + x;
    const k = nhan[i];
    let r = BANG_MAU[k][1] * 4, g = BANG_MAU[k][2] * 4, b = BANG_MAU[k][3] * 4, tong = 4;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      const j = nx < 0 || ny < 0 || nx >= w || ny >= h ? k : nhan[ny * w + nx];
      r += BANG_MAU[j][1]; g += BANG_MAU[j][2]; b += BANG_MAU[j][3]; tong++;
    }
    out[i * 3] = Math.round(r / tong);
    out[i * 3 + 1] = Math.round(g / tong);
    out[i * 3 + 2] = Math.round(b / tong);
  }
console.log('\n3 · LÀM MỀM RANH GIỚI  1px, để mảng bệt mà mép không răng cưa');

// --- 4. khung hình
const nenK = nhan[4 * w + 4];
let x0 = w, y0 = h, x1 = -1, y1 = -1;
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++)
    if (nhan[y * w + x] !== nenK) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
const cao = y1 - y0 + 1;
console.log(`\n4 · KHUNG  nội dung cao ${cao}px = ${(cao / h * 100).toFixed(1)}% khung`);

let W = w, H = h, cuoi = out;
if (coCat) {
  const canh = Math.min(Math.min(w, h), Math.round(cao / 0.70));
  const cx = Math.round((x0 + x1) / 2), cy = Math.round((y0 + y1) / 2);
  const ax = Math.max(0, Math.min(w - canh, cx - (canh >> 1)));
  const ay = Math.max(0, Math.min(h - canh, cy - (canh >> 1)));
  cuoi = new Uint8Array(canh * canh * 3);
  for (let y = 0; y < canh; y++)
    for (let x = 0; x < canh; x++)
      for (let c = 0; c < 3; c++)
        cuoi[(y * canh + x) * 3 + c] = out[((ay + y) * w + ax + x) * 3 + c];
  W = H = canh;
  console.log(`     cắt còn ${canh}×${canh} từ (${ax}, ${ay}) → nhân vật chiếm ${(cao / canh * 100).toFixed(1)}%`);
  console.log(`     ⚠ cắt theo nhân vật thì góc ảnh rơi ra ngoài. Nếu ở đó có dấu ghi nguồn thì`);
  console.log(`       nó bị cắt một phần — đó là hệ quả, không phải mục đích. Muốn giữ thì bỏ --cat.`);
} else {
  const canh = Math.round(cao / 0.70);
  console.log(`     không cắt. Muốn 70% thì cắt còn ${canh}×${canh} — thêm cờ --cat`);
}

maHoaPng(ra, W, H, cuoi);
{
  const d = new Set();
  for (let i = 0; i < W * H; i++) d.add((cuoi[i * 3] << 16) | (cuoi[i * 3 + 1] << 8) | cuoi[i * 3 + 2]);
  console.log(`\nRA    ${ra}  ${W}×${H}`);
  console.log(`      ${d.size.toLocaleString('vi')} màu khác nhau (9 màu bệt + ranh giới)\n`);
}
