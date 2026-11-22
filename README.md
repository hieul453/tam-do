# Tâm Đồ

> Bản đồ tâm lý học của riêng bạn.

Web app PWA tiếng Việt, mobile-first, để ôn tập kiến thức tâm lý học. Mỗi bài học có ba tầng:
⚡ Hiểu nhanh · 📖 Đào sâu · 🌱 Áp dụng.

**Bản chạy thật: https://tam-do-nu.vercel.app**

**Giai đoạn hiện tại: chỉ có hạ tầng.** Chưa có tính năng nào. Trang duy nhất là màn
*Kiểm tra hạ tầng*, dùng để xác nhận stack chạy đúng — mở ra phải thấy 5 dòng xanh.

## Chạy thử

```powershell
npm install
```

```powershell
npm run dev
```

Chưa có `.env.local` thì app vẫn mở được, chỉ không lưu tiến độ. Để nối Supabase, làm theo
[docs/SETUP.md](docs/SETUP.md).

Xem trên điện thoại cùng wifi:

```powershell
npm run dev:dienthoai
```

## Tài liệu

| File | Nội dung |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Luật code chung cho cả hai người. Đọc trước khi sửa gì |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Chọn stack gì, vì sao, và cố tình bỏ gì |
| [docs/SETUP.md](docs/SETUP.md) | Cài đặt, tạo Supabase, nối Vercel, cấp quyền |
| [docs/SPEC-SAN-PHAM.md](docs/SPEC-SAN-PHAM.md) | Spec sản phẩm: nội dung, trải nghiệm, màu, linh vật |
| [docs/PLAN-GOC.md](docs/PLAN-GOC.md) | Kế hoạch sản phẩm ban đầu (tham khảo) |

## Stack

Vite · React 19 · TypeScript · Tailwind v4 · React Router · TanStack Query ·
Supabase (Postgres + Auth + RLS) · Vercel

Chi tiết và lý do: [ARCHITECTURE.md](ARCHITECTURE.md).

## Hạ tầng đang chạy

| | |
|---|---|
| Repo | [github.com/hieul453/tam-do](https://github.com/hieul453/tam-do) — public, `main` được bảo vệ |
| Bản live | [tam-do-nu.vercel.app](https://tam-do-nu.vercel.app) — tự deploy mỗi lần `main` thay đổi |
| Preview | mỗi pull request có một URL riêng, mở được trên điện thoại |
| Database | Supabase `crbpqbjdvakhwmoybicw`, region Singapore (`ap-southeast-1`), Postgres 17 |
| Đăng nhập | ẩn danh · liên kết Google (giữ nguyên `user_id`, không mất tiến độ) |
| Chi phí | 0 đồng. GitHub public (Actions không giới hạn phút), Supabase Free, Vercel hobby |

**Cách làm việc:** không push thẳng vào `main`. Mỗi thay đổi một nhánh, một pull request,
CI phải xanh, xem bản preview rồi mới merge.

Hai hạn mức của gói miễn phí cần nhớ:

- **Supabase tạm dừng project sau 7 ngày không hoạt động.** Không mất dữ liệu, nhưng phải
  vào dashboard bấm khôi phục.
- **Vercel hobby không dùng cho mục đích thương mại.** Dự án cá nhân thì đúng luật.

## Nội dung

Nội dung bài học là markdown trong `content/`, **không nằm trong database**. Sửa nội dung là
sửa file, có history git, review được qua pull request.

| File | Trạng thái |
|---|---|
| `content/khung-tlh-dai-cuong.md` | Khung 16 chương, ~104 bài |
| `content/chuong-06-tri-nho.md` | 7 bài, đủ 3 tầng, đã kiểm chứng nguồn |
| `content/_khuon-mau-bai-hoc.md` | **Khuôn để soạn chương mới** |

### Sửa nội dung rồi xem kết quả

```powershell
npm run content:check
```

Lệnh này đọc markdown và báo bằng tiếng Việt nếu bài nào thiếu mục bắt buộc —
ví dụ thiếu thẻ kiểm tra ở cuối, hay chỉ có 2 điều cần nhớ thay vì 3.

```powershell
npm run dev
```

Rồi mở **http://localhost:5173/noi-dung** để xem markdown của mình được đọc ra thành gì.
Mục nào hiện trống hoặc sai chỗ nghĩa là viết lệch khuôn.

Đẩy lên pull request thì CI chạy đúng lệnh kiểm tra đó, và Vercel đẻ ra một link xem được
trên điện thoại — **không cần cài gì cũng sửa được nội dung**.

### Nội dung biến thành dữ liệu thế nào

```
content/chuong-06-tri-nho.md
   │  scripts/build-content.ts  (đọc markdown)
   │  src/content/schema.ts     (Zod kiểm mọi mục bắt buộc)
   ▼
src/content/generated/tlhdc-06.json      ← không commit, luôn dựng lại
   │
   ▼
app đọc qua src/content/index.ts
```

`src/content/generated/` do script sinh ra — **đừng sửa tay**, sửa markdown rồi dựng lại.
