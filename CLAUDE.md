# CLAUDE.md — Tâm Đồ

> Bộ não chung của dự án. Đọc trước khi sửa bất cứ gì.
>
> - Kiến trúc và lý do chọn: [ARCHITECTURE.md](ARCHITECTURE.md)
> - Cài đặt, cấp quyền, token: [docs/SETUP.md](docs/SETUP.md)
> - Tham chiếu sản phẩm gốc (chỉ để tham khảo định hướng): [docs/SPEC-SAN-PHAM.md](docs/SPEC-SAN-PHAM.md)

## Dự án là gì

**Một Duolingo cho tâm lý học.** Web app PWA tiếng Việt, mobile-first, học bằng
những phiên ngắn có cảm giác chơi.

Bản live: https://tam-do-nu.vercel.app

Khác Duolingo ở một điểm cốt lõi: mỗi **Phần** có **ba hướng tiếp cận cùng một nội dung**.

| | |
|---|---|
| ⚡ **Nhanh** | Mì ăn liền — thẻ lật, câu hỏi ngắn, vài phút |
| 📖 **Đào sâu** | Học thuật — nghiên cứu thật, dẫn nguồn đầy đủ |
| 🌱 **Áp dụng** | Đưa vào đời sống, có trợ lý AI tư vấn theo chuyện của chính người dùng |

## Cấu trúc nội dung

```
Nhánh   (= Section)   Tâm lý học nhận thức, xã hội, phát triển…
  Chương (= Unit)     Trí nhớ, Chú ý…
    Phần  (= Node)    một chặng trên lộ trình
      3 hướng tiếp cận
```

Nội dung nằm ở `src/content/du-lieu/*.ts`, **không trong database**. Sửa file là xong,
có history git, sai kiểu thì `npm run typecheck` báo ngay. Schema ở `src/content/schema.ts`.

Pilot mở **một nhánh** (`nhan-thuc`), **một chương** (`tri-nho`), **ba phần**. Mọi thứ khác
mang `trangThai: 'sap-co'` và vẫn hiện trên lộ trình — người xem thấy app sẽ lớn tới đâu.

## Lệnh

```bash
npm run dev            # http://localhost:5173
npm run dev:dienthoai  # mở được từ điện thoại cùng wifi
npm run typecheck
npm test
npm run format
npm run build
```

## Hai bố cục, khác nhau thật

Theo đúng cách Duolingo làm, và đây là yêu cầu sản phẩm chứ không phải tuỳ chọn:

| | |
|---|---|
| **Web ≥1024px** | thanh điều hướng **dọc** bên trái · nội dung giữa · cột phải chứa số liệu và nhắc nhở (xuất hiện từ 1280px) |
| **Mobile <1024px** | thanh số liệu mỏng trên cùng · nội dung · thanh tab **ngang** dưới cùng |

Chuyển bằng CSS, không bằng JS — không nhấp nháy lúc tải, không nghe resize, một cây DOM.
Xem `src/components/layout/Khung.tsx`.

## Luật không được phá

1. **Không viết mã màu trong component.** Token ở `src/styles/index.css` block `@theme`.
   Dùng `bg-nhan`, `text-chu-phu`, `rounded-vua`, `border-vien`…
2. **Màu phải mang nghĩa.** Đây là app minimalism: màu dùng để báo trạng thái
   (đúng/sai/đã xong/đang khoá), không để trang trí. Thấy mình tô màu cho đẹp là sai hướng.
3. **Thêm bảng database là phải bật RLS** và một policy `auth.uid() = user_id`.
   Sửa migration rồi thì **chạy lại** (`node .git/sql.mjs <file>`) và chạy
   `node .git/sb-07-test-rls-m3.mjs` — bộ này tấn công database bằng chính khoá anon
   công khai, 25 phép thử.
4. **`service_role` key và `GEMINI_API_KEY` không bao giờ vào biến `VITE_*`.** Mọi biến
   `VITE_*` đều lộ trong bundle. Khoá AI gọi qua serverless function, không gọi thẳng từ trình duyệt.
5. **Không commit vào `main`.** Mỗi thay đổi một nhánh, một pull request, CI xanh rồi mới merge.
6. **Nhật ký và câu chuyện người dùng kể cho AI là dữ liệu nhạy cảm.** Không log nội dung,
   không analytics, không gửi đi đâu ngoài lời gọi AI đang phục vụ chính người đó.
7. **Tôn trọng `prefers-reduced-motion`.** Đã xử lý ở `index.css`; đừng viết animation bỏ qua nó.
8. **Số liệu nghiên cứu phải có nguồn mở được.** Không bịa con số, không bịa tên nghiên cứu.
   Thiếu nguồn thì ghi là thiếu.
9. **Vùng chạm tối thiểu 44px, tương phản chữ tối thiểu 4.5:1.**
10. **Không báo "đã xong" trước khi database xác nhận.** Dấu tích, XP, chuỗi ngày đều phải
    đợi lời gọi trả về. Đã vấp: lời gọi hỏng mà màn hình vẫn báo "+15 XP".

## Ngôn ngữ

- Giao diện và nội dung: **tiếng Việt**. Thuật ngữ kèm tiếng Anh trong ngoặc khi cần.
- Tên biến, hàm: tiếng Việt không dấu khi thuộc miền sản phẩm (`danhSachThe`, `laAnDanh`,
  `trangThai`), tiếng Anh khi là khái niệm kỹ thuật chung (`useState`, `queryClient`).
  Không trộn nửa vời trong cùng một tên.

## Quy ước code

- Mobile-first: thiết kế cho 375px trước, rồi mới nới ra.
- Mỗi tính năng một thư mục trong `src/features/`. Component dùng chung ở `src/components/`.
- Tiến độ, XP, chuỗi ngày, tim: tất cả đi qua `src/features/tiendo/duLieu.ts`, đừng gọi
  thẳng `supabase.rpc` ở màn hình.
- Dùng `@/` cho import nội bộ.
- Server state qua TanStack Query, không tự viết `useEffect` + `fetch`.
- Chạy `npm run format` trước khi commit; CI kiểm định dạng.
- **Không thêm thư viện mới nếu chưa bàn.**

**Chưa có ESLint** — TypeScript 7 quá mới, `typescript-eslint` chưa hỗ trợ (peer range dừng
ở `<6.1.0`). Dựa vào `tsc --strict` và Prettier. Thử lại khi họ ra bản hỗ trợ TS 7.

## Khi nào phải hỏi lại

- Trước khi thêm thư viện hoặc đổi stack.
- Trước khi sửa migration đã chạy trên database thật — viết migration mới.
- Khi nội dung thiếu nguồn. Đừng tự điền.
