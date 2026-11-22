# Tâm Đồ

> Một Duolingo cho tâm lý học.

Web app PWA tiếng Việt, mobile-first. Học bằng những phiên ngắn, mỗi Phần có **ba hướng
tiếp cận cùng một nội dung**: ⚡ Nhanh · 📖 Đào sâu · 🌱 Áp dụng.

**Bản chạy thật: https://tam-do-nu.vercel.app**

## Chạy thử

```powershell
npm install
```

```powershell
npm run dev
```

Xem trên điện thoại cùng wifi:

```powershell
npm run dev:dienthoai
```

Chưa có `.env.local` thì app vẫn mở được, chỉ không lưu tiến độ. Xem [docs/SETUP.md](docs/SETUP.md).

## Tài liệu

| File | Nội dung |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Luật code. Đọc trước khi sửa gì |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Chọn gì, vì sao, cố tình bỏ gì, lộ trình |
| [docs/SETUP.md](docs/SETUP.md) | Cài đặt, token, Supabase, Vercel |
| [docs/SPEC-SAN-PHAM.md](docs/SPEC-SAN-PHAM.md) | Tài liệu sản phẩm gốc — chỉ tham khảo định hướng |

## Sửa nội dung

Nội dung là TypeScript, không phải database:

```
src/content/schema.ts       hợp đồng — mỗi loại bài tập cần những trường gì
src/content/du-lieu/*.ts    nội dung thật
```

Sửa file rồi `npm run typecheck`. Sai cấu trúc là báo ngay, không đợi tới lúc chạy.

Pilot mở một nhánh (Tâm lý học nhận thức), một chương (Trí nhớ), ba phần. Mọi thứ khác
mang `trangThai: 'sap-co'` và vẫn hiện trên lộ trình.

## Hai bố cục

Web và điện thoại **khác nhau thật**, không phải cùng một trang co giãn:

- **Web ≥1024px** — điều hướng dọc bên trái, cột phải chứa số liệu (từ 1280px)
- **Mobile <1024px** — thanh số liệu trên, tab ngang dưới

## Stack

Vite · React 19 · TypeScript · Tailwind v4 · React Router · TanStack Query ·
Supabase · Gemini · Vercel

Lý do chọn từng thứ: [ARCHITECTURE.md](ARCHITECTURE.md).
