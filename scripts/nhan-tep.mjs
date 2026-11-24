// Cổng nhận tệp cục bộ: trình duyệt POST byte thẳng xuống đĩa.
//
//   node scripts/nhan-tep.mjs
//   # rồi trong trang đang mở:
//   await fetch('http://localhost:5199/public/icon-512.png', { method: 'POST', body: blob })
//
// Dùng khi cần lấy dữ liệu nhị phân RA KHỎI trình duyệt — xuất PNG từ canvas,
// lưu ảnh chụp, kết xuất một tệp do trang tạo ra. Cách hiển nhiên là chuyển
// base64 qua chỗ khác, nhưng một ảnh 512px là hơn 250 nghìn ký tự: chậm, tốn,
// và dễ hỏng giữa chừng. Gửi thẳng byte thì không mất gì cả.
//
// Chỉ nghe ở localhost và chỉ chạy khi mình chủ động bật. Tắt đi khi xong.
import { createServer } from 'node:http'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const GOC = process.cwd()
const CONG = Number(process.env.CONG ?? 5199)

createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') return res.end()
  if (req.method !== 'POST') return res.writeHead(405).end()

  const ten = decodeURIComponent(req.url.slice(1))
  // Chỉ cho ghi trong thư mục dự án: không ký tự lạ, không đi ngược lên trên.
  if (!/^[\w./-]+$/.test(ten) || ten.includes('..')) return res.writeHead(400).end('tên xấu')

  const manh = []
  req.on('data', (c) => manh.push(c))
  req.on('end', () => {
    const du = Buffer.concat(manh)
    const duongDan = join(GOC, ten)
    mkdirSync(dirname(duongDan), { recursive: true })
    writeFileSync(duongDan, du)
    console.log(`ghi ${ten} — ${du.length} byte`)
    res.end('ok')
  })
}).listen(CONG, '127.0.0.1', () => console.log(`cổng nhận tệp: http://localhost:${CONG}`))
