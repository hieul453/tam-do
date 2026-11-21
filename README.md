# Tâm Đồ

> Bản đồ tâm lý học của riêng bạn.

Web app PWA tiếng Việt, mobile-first, để ôn tập kiến thức tâm lý học. Mỗi bài học có ba tầng:
⚡ Hiểu nhanh · 📖 Đào sâu · 🌱 Áp dụng.

**Giai đoạn hiện tại: chỉ có hạ tầng.** Chưa có tính năng nào. Trang duy nhất là màn
*Kiểm tra hạ tầng*, dùng để xác nhận stack chạy đúng.

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

## Nội dung

Nội dung bài học là markdown trong `content/`, **không nằm trong database**. Sửa nội dung là
sửa file, có history git, review được qua pull request.

| File | Trạng thái |
|---|---|
| `content/khung-tlh-dai-cuong.md` | Khung 16 chương, ~104 bài |
| `content/chuong-06-tri-nho.md` | 7 bài, đủ 3 tầng, đã kiểm chứng nguồn |
