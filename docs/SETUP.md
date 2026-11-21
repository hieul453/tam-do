# Cài đặt và cấp quyền

> Danh sách việc cần làm một lần để dự án chạy được và để Claude làm việc tự động.
> Đánh dấu `[x]` khi xong.

Phần 1 và 2 là bắt buộc. Phần 3 làm khi partner bắt đầu tham gia.

---

## 1. Máy của bạn

Đã có sẵn: Node v24, npm, git, pnpm. Thiếu `gh` — không có nó thì Claude không tạo được
repo, không mở được pull request, không đặt được branch protection.

- [ ] Cài GitHub CLI

```powershell
winget install --id GitHub.cli --source winget
```

- [ ] Đăng nhập (mở browser, chọn Authorize)

```powershell
gh auth login --web --scopes repo,workflow
```

Supabase CLI đã nằm trong `devDependencies` của repo, không cần cài riêng — gọi bằng
`npx supabase` hoặc qua `npm run db:push`. Làm vậy để hai máy luôn dùng cùng một version.

Sau khi cài `gh`, **mở lại cửa sổ terminal** rồi kiểm tra:

```powershell
gh auth status
```

---

## 2. Supabase

- [ ] Tạo project ở [supabase.com/dashboard](https://supabase.com/dashboard) — gói Free.
  **Region: Southeast Asia (Singapore)** — gần Việt Nam nhất, giảm độ trễ rõ rệt.
- [ ] Lưu lại mật khẩu database mà nó sinh ra. Mất là phải reset.

### Bật đăng nhập

Vào **Authentication → Sign In / Providers**:

- [ ] Bật **Anonymous sign-ins** — để vào app là dùng được ngay, không bắt đăng nhập.
- [ ] Bật **Google**. Cần Client ID và Client Secret, lấy ở
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
  tạo OAuth 2.0 Client ID, loại Web application, rồi dán **Authorized redirect URI**
  mà Supabase hiển thị sẵn trong màn hình cấu hình Google đó.
- [ ] Vào **Authentication → Advanced**, bật **Manual linking** — để tài khoản ẩn danh
  nâng cấp lên Google mà giữ nguyên dữ liệu.

> Ba bước này chỉ bạn làm được, vì phải bấm trong browser và đăng nhập Google.

### Lấy hai giá trị cho app

Vào **Project Settings → API**, copy:

- [ ] **Project URL** → `VITE_SUPABASE_URL`
- [ ] **anon public key** → `VITE_SUPABASE_ANON_KEY`

Tạo file `.env.local` ở gốc repo (file này đã được gitignore):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> `anon key` được thiết kế để nằm công khai trong code frontend. An toàn dữ liệu đến từ
> Row Level Security trong Postgres, không từ việc giấu key. Không cần lo khi thấy nó
> trong bundle.

### Để Claude tự chạy migration

Chọn một trong hai:

- [ ] **Cách gọn hơn:** đưa Claude **connection string** của project này
  (Project Settings → Database → Connection string → URI). Phạm vi ảnh hưởng chỉ gói trong
  một database của project pilot.
- [ ] **Cách thủ công:** bạn tự mở SQL Editor, dán nội dung
  `supabase/migrations/0001_khoi_tao.sql` vào rồi Run.

### ĐỪNG đưa Claude

- Mật khẩu tài khoản Google của bạn.
- **`service_role` key** của Supabase — key này bỏ qua toàn bộ RLS. Giai đoạn này không cần đến nó.

---

## 3. GitHub và Vercel

- [ ] Chốt tên repo và public hay private.
- [ ] Để Claude tạo repo, push code, bật branch protection cho `main`
  (không ai push trực tiếp, phải qua pull request và CI phải xanh).
- [ ] Lấy **username GitHub của partner** → mời làm collaborator.
- [ ] Vào [vercel.com](https://vercel.com), đăng nhập **bằng GitHub**, bấm Import repo.
  Vercel tự nhận ra đây là Vite, không cần cấu hình gì.
- [ ] Trong Vercel → Settings → Environment Variables, thêm đúng hai biến
  `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` cho cả ba môi trường
  (Production, Preview, Development).
- [ ] Copy URL production của Vercel, quay lại Supabase →
  **Authentication → URL Configuration**, thêm vào **Redirect URLs**:
  URL production, và `https://*.vercel.app/**` để link preview cũng đăng nhập được.

> Không cần tạo Vercel token. Nối repo qua dashboard một lần là từ đó mỗi push tự deploy,
> và mỗi pull request tự có một URL xem trước.

---

## 4. Tuỳ chọn

- [ ] **Sentry** — đáng làm sớm. Khi partner báo "app lỗi rồi" thì có stack trace thật
  thay vì đoán. Chỉ cần một DSN, dán vào `VITE_SENTRY_DSN`.
- [ ] Domain riêng.

---

## 5. Partner tham gia bằng cách nào

**Mức 1 — chỉ nội dung, không cài gì.** Sửa `content/*.md` ngay trên GitHub web
(nút bút chì), hoặc soạn ở claude.ai rồi dán vào. Tạo pull request → CI kiểm format →
Vercel đẻ ra một link → mở link trên điện thoại xem bài của mình → merge.
Setup 0 phút. **Bắt đầu từ mức này.**

**Mức 2 — vibe code thật.** Cài Node, git, Claude Code; clone repo; `npm run dev`.
Khoảng 30 phút setup. Làm sau khi dự án đã chạy ổn.

---

## Kiểm tra lại

Xong phần 1 và 2 thì chạy:

```powershell
npm run dev
```

Mở `http://localhost:5173`. Trang **Kiểm tra hạ tầng** phải xanh cả 5 dòng. Dòng nào đỏ
thì nó ghi rõ thiếu gì.
