// Chạy SQL trên Supabase qua Management API.
//
//   node scripts/sql.mjs supabase/migrations/0001_vi_du.sql
//   node scripts/sql.mjs -e "select now()"
//
// Vì sao đọc SQL từ file chứ không nhận thẳng chuỗi dài: shell trên Windows
// hay nuốt hoặc đổi dấu nháy, và một dấu nháy sai trong câu SQL thì thông báo
// lỗi trả về chẳng liên quan gì tới chuyện đó. Đã mất một lúc mới tìm ra.
//
// Token lấy từ kho DPAPI, không nằm trong repo:
//   & "$env:LOCALAPPDATA\ai-tokens\token.ps1" set supabase
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const REF = process.env.SUPABASE_PROJECT_REF ?? 'crbpqbjdvakhwmoybicw'

function layToken(ten) {
  const ps = `& (Join-Path $env:LOCALAPPDATA 'ai-tokens\\token.ps1') get ${ten}`
  return execSync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${ps}"`, {
    encoding: 'utf8',
  }).trim()
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Dùng: node scripts/sql.mjs <file.sql> | -e "<câu sql>"')
  process.exit(2)
}
const sql = args[0] === '-e' ? args[1] : readFileSync(args[0], 'utf8')

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${layToken('supabase')}`,
    'User-Agent': 'tam-do',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})

const du = await res.json()
if (!res.ok) {
  console.error(`LỖI HTTP ${res.status}:`, du.message ?? JSON.stringify(du))
  process.exit(1)
}
if (Array.isArray(du) && du.length === 0) {
  console.log('(chạy xong, không trả về dòng nào)')
} else {
  console.log(JSON.stringify(du, null, 2))
}
