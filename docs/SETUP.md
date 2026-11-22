# Cài đặt và cấp quyền

> Việc làm một lần để dự án chạy được. Hầu hết đã xong — giữ file này để dựng lại
> khi đổi máy, hoặc khi partner tham gia.

**Trạng thái: hạ tầng đã chạy.** Còn lại duy nhất đăng nhập Google (mục 2c).

---

## 1. Máy làm việc ✅

- [x] Node 20+, git, npm
- [x] GitHub CLI

```powershell
winget install --id GitHub.cli --source winget
```

```powershell
gh auth login --hostname github.com --git-protocol https --web --scopes repo,workflow
```

Supabase CLI nằm trong `devDependencies`, gọi bằng `npx supabase`, không cần cài riêng.

### Kho token

Token của các dịch vụ cất ở `%LOCALAPPDATA%\ai-tokens`, mã hoá bằng DPAPI gắn với tài
khoản Windows. Xem `%LOCALAPPDATA%\ai-tokens\README.md`.

```powershell
& "$env:LOCALAPPDATA\ai-tokens\token.ps1" list
```

Đang có: `github`, `supabase`, `vercel`, `supabase-db-pass`.

> Token GitHub hiện đang full scope (gồm `delete_repo`, `admin:org`). Dự án chỉ cần
> `repo` và `workflow`. Nên thay bằng token hẹp hơn khi có dịp.

---

## 2. Supabase

- [x] Project `crbpqbjdvakhwmoybicw`, region **Southeast Asia (Singapore)**, Postgres 17
- [x] Migration `supabase/migrations/0001_khoi_tao.sql` — 8 bảng, RLS bật trên tất cả
- [x] Anonymous sign-ins
- [x] Manual linking (để tài khoản ẩn danh nâng cấp lên Google mà giữ nguyên `user_id`)
- [x] Redirect URL cho các domain Vercel và `localhost:5173`

> **Region không đổi được sau khi tạo.** Lần đầu lỡ tạo ở Tokyo, phải xoá làm lại.
> Đo thật từ Việt Nam: Singapore ~72ms, Tokyo ~131ms.

### 2c. Đăng nhập Google ✅

Đã bật và đã thử đầu cuối bằng tài khoản thật: bấm nút trên app → đăng nhập Google →
quay về app với mã người dùng **không đổi**.

Cấu hình đã dùng, ghi lại để dựng lại khi cần:

- OAuth client loại **Web application** ở [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Authorized redirect URI** — trỏ về Supabase, **không phải** về Vercel:

  ```
  https://crbpqbjdvakhwmoybicw.supabase.co/auth/v1/callback
  ```

- **Authorized JavaScript origins**: `https://tam-do-nu.vercel.app` và `http://localhost:5173`
- Scope: chỉ `email`, `profile`, `openid`
- Client ID và secret cất trong kho token: `google-client-id`, `google-client-secret`

> **Cái bẫy số một:** dán nhầm domain Vercel vào Authorized redirect URI. Luồng thật là
> app → Google → **Supabase** → app, nên URI phải trỏ về Supabase.
>
> **Cái bẫy số hai:** màn hình đồng ý ở chế độ **Testing** thì chỉ email trong danh sách
> Test users mới đăng nhập được. Vì chỉ xin scope không nhạy cảm nên **Publish không cần
> Google duyệt** — bấm là có hiệu lực ngay.

Bật lại bằng một lệnh nếu phải dựng lại:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\tam-do\.git\sb-06-google.ps1"
```

### Giới hạn của token Supabase

Personal access token **không tạo được project** (HTTP 403) và không đọc được
`/v1/organizations`. Nhưng chạy SQL, sửa cấu hình auth, lấy anon key, xoá project thì được.
Nên tạo project luôn phải làm trong dashboard.

---

## 3. GitHub và Vercel ✅

- [x] Repo [hieul453/tam-do](https://github.com/hieul453/tam-do), public
- [x] Branch protection trên `main`: bắt buộc PR, bắt buộc check `kiem-tra` xanh,
      chặn force push và xoá nhánh
- [x] Vercel project nối với repo, tự deploy khi `main` đổi
- [x] `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` cho cả production, preview, development
- [x] Deployment Protection **đã tắt** — mặc định của team là bắt đăng nhập mới xem được
- [ ] Mời partner làm collaborator (cần username GitHub)

Hai lựa chọn cố ý khác mặc định:

- **Số approval = 0.** GitHub không cho tự approve PR của mình; để 1 thì bạn tự khoá mình.
  Vẫn bắt buộc có PR và CI xanh.
- **Admin không bị chặn.** Để còn đường gỡ khi CI hỏng vì lý do ngoài code.

### Bẫy của Vercel API

Ghi lại vì mất khá nhiều thời gian:

- Biến môi trường phải đặt `type: 'plain'`. `type: 'encrypted'` bị trả **403**.
- **Đừng** truyền `teamId` — token này với tới project mà không cần, thêm vào lại thành 404.
- PowerShell 5.1 để body lỗi HTTP ở `$_.ErrorDetails.Message`, không phải ở response stream.
- Tên biến PowerShell **không phân biệt hoa thường**: `foreach ($v in ...)` sẽ ghi đè `$V`.

---

## 4. Tuỳ chọn

- [ ] **Sentry** — đáng làm sớm, để khi partner báo "app lỗi rồi" thì có stack trace thật.
- [ ] Domain riêng.

---

## 5. Partner tham gia bằng cách nào

**Mức 1 — chỉ nội dung, không cài gì.** Sửa `content/*.md` trên GitHub web (nút bút chì),
hoặc soạn ở claude.ai rồi dán vào. Tạo pull request → CI kiểm tra → Vercel đẻ ra một link →
mở link trên điện thoại xem bài của mình → merge. Setup 0 phút. **Bắt đầu từ mức này.**

**Mức 2 — vibe code thật.** Cài Node, git, Claude Code; clone repo; `npm run dev`.
Khoảng 30 phút setup.

---

## Kiểm tra lại bất cứ lúc nào

```powershell
npm run dev
```

Mở `http://localhost:5173`, trang **Kiểm tra hạ tầng** phải xanh cả 5 dòng.

Hoặc mở thẳng bản live: **https://tam-do-nu.vercel.app**
