// Đọc và ghi PNG bằng node:zlib, không phụ thuộc thư viện nào.
//
// Có vì hai script linh vật đều cần, và vì luật dự án nói không thêm thư viện
// khi chưa bàn. PNG thì zlib làm được gần hết: chỉ còn lọc từng dòng và CRC.
//
// Đỡ: bitDepth 8, không interlace, colorType 0 / 2 / 3 / 4 / 6.

import { readFileSync, writeFileSync } from 'node:fs'
import { inflateSync, deflateSync } from 'node:zlib'

const bangCrc = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

const crc32 = (buf) => {
  let c = -1
  for (const b of buf) c = bangCrc[(c ^ b) & 255] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

const khoi = (loai, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const than = Buffer.concat([Buffer.from(loai, 'ascii'), data])
  const c = Buffer.alloc(4)
  c.writeUInt32BE(crc32(than))
  return Buffer.concat([len, than, c])
}

/** Đọc một tệp PNG. Trả về { w, h, rgb } với rgb là Uint8Array phẳng 3 byte/pixel. */
export function docPng(duongDan) {
  const buf = readFileSync(duongDan)
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Không phải tệp PNG')

  let w = 0,
    h = 0,
    bitDepth = 0,
    colorType = 0,
    interlace = 0,
    plte = null
  const idat = []

  for (let i = 8; i + 8 <= buf.length;) {
    const len = buf.readUInt32BE(i)
    const loai = buf.toString('ascii', i + 4, i + 8)
    const data = buf.subarray(i + 8, i + 8 + len)
    if (loai === 'IHDR') {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlace = data[12]
    } else if (loai === 'PLTE') plte = data
    else if (loai === 'IDAT') idat.push(data)
    else if (loai === 'IEND') break
    i += 12 + len
  }

  if (bitDepth !== 8) throw new Error(`Chỉ đọc được bitDepth 8, tệp này ${bitDepth}`)
  if (interlace !== 0) throw new Error('Không đọc được ảnh interlace')

  const soKenh = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType]
  if (!soKenh) throw new Error(`colorType không đỡ được: ${colorType}`)

  const raw = inflateSync(Buffer.concat(idat))
  const stride = w * soKenh
  const phang = Buffer.alloc(h * stride)

  let pos = 0
  for (let y = 0; y < h; y++) {
    const loc = raw[pos++]
    const dong = raw.subarray(pos, pos + stride)
    pos += stride
    const cur = phang.subarray(y * stride, (y + 1) * stride)
    const tren = y > 0 ? phang.subarray((y - 1) * stride, y * stride) : null
    for (let x = 0; x < stride; x++) {
      const a = x >= soKenh ? cur[x - soKenh] : 0
      const b = tren ? tren[x] : 0
      const c = tren && x >= soKenh ? tren[x - soKenh] : 0
      let v = dong[x]
      if (loc === 1) v = (v + a) & 255
      else if (loc === 2) v = (v + b) & 255
      else if (loc === 3) v = (v + ((a + b) >> 1)) & 255
      else if (loc === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a),
          pb = Math.abs(p - b),
          pc = Math.abs(p - c)
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255
      } else if (loc !== 0) throw new Error(`filter không đỡ được: ${loc}`)
      cur[x] = v
    }
  }

  const rgb = new Uint8Array(w * h * 3)
  for (let i = 0, n = w * h; i < n; i++) {
    let r, g, b
    if (colorType === 2 || colorType === 6) {
      r = phang[i * soKenh]
      g = phang[i * soKenh + 1]
      b = phang[i * soKenh + 2]
    } else if (colorType === 0 || colorType === 4) {
      r = g = b = phang[i * soKenh]
    } else {
      const k = phang[i] * 3
      r = plte[k]
      g = plte[k + 1]
      b = plte[k + 2]
    }
    rgb[i * 3] = r
    rgb[i * 3 + 1] = g
    rgb[i * 3 + 2] = b
  }

  return { w, h, rgb }
}

/** Ghi một tệp PNG 8-bit RGB. */
export function ghiPng(duongDan, w, h, rgb) {
  const stride = w * 3
  const than = Buffer.alloc(h * (stride + 1))
  for (let y = 0; y < h; y++) {
    than[y * (stride + 1)] = 0 // filter 0, không lọc
    for (let x = 0; x < stride; x++) than[y * (stride + 1) + 1 + x] = rgb[y * stride + x]
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bitDepth
  ihdr[9] = 2 // colorType RGB
  writeFileSync(
    duongDan,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      khoi('IHDR', ihdr),
      khoi('IDAT', deflateSync(than, { level: 9 })),
      khoi('IEND', Buffer.alloc(0)),
    ]),
  )
}
