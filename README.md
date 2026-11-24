# tam-do

Bộ khung dự án web, đã chạy thật qua một vòng POC trọn vẹn.

Vòng đầu là một app học tâm lý học kiểu Duolingo (M1→M5, tháng 11/2026). App đó
đã được dọn đi để bắt đầu lại; **lịch sử git giữ nguyên mọi thứ**.

## Bắt đầu

```bash
npm install
npm run dev     # http://localhost:5173
```

## Còn lại những gì

| | |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Luật dự án, quy ước, stack |
| [docs/BAI-HOC.md](docs/BAI-HOC.md) | **Những cái bẫy đã mất thời gian thật để tìm ra** — đọc trước khi dựng lại |
| [docs/SETUP.md](docs/SETUP.md) | Cài đặt, cấp quyền, token |
| [scripts/](scripts/) | Công cụ dùng chung |
| `.github/workflows/ci.yml` | format · typecheck · test · build, chạy trên mọi PR |
| `.claude/` | Quyền cho Claude Code |

Hạ tầng vẫn nối sẵn: Supabase (Postgres + Auth + RLS, vùng Singapore) và Vercel
(hosting, preview mỗi PR). Token nằm trong kho DPAPI ở `%LOCALAPPDATA%\ai-tokens`,
không có gì nhạy cảm trong repo.

## Xem lại bản cũ

```bash
git log --oneline                      # M1 → M5
git show <commit>:src/App.tsx          # một file ở thời điểm nào đó
git checkout <commit> -- <duong-dan>   # lấy lại một phần
```
