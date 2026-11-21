# CLAUDE.md — Tâm Đồ

> File này là bộ não chung. Cả hai người làm dự án đều vibe code, nên mọi phiên
> Claude phải ra cùng một kiểu code. Đọc file này trước khi sửa bất cứ gì.
>
> - Kiến trúc và lý do chọn stack: [ARCHITECTURE.md](ARCHITECTURE.md)
> - Spec sản phẩm (nội dung, trải nghiệm, màu, linh vật): [docs/SPEC-SAN-PHAM.md](docs/SPEC-SAN-PHAM.md)
> - Cài đặt và cấp quyền: [docs/SETUP.md](docs/SETUP.md)

## Dự án là gì

Web app PWA tiếng Việt, mobile-first, ôn tập kiến thức tâm lý học. Mỗi bài có 3 tầng:
⚡ Hiểu nhanh (thẻ vuốt) · 📖 Đào sâu (bài đọc) · 🌱 Áp dụng (thử thách + nhật ký).
Giai đoạn hiện tại: môn Tâm lý học đại cương, chế độ ôn tập.

Hai người làm: một người có nền tảng kỹ thuật, một người không. **Viết code cho người
không có nền tảng kỹ thuật đọc được.** Comment bằng tiếng Việt khi giải thích *vì sao*,
không comment lại những gì code đã nói rõ.

## Ngôn ngữ

- Giao diện, nội dung, thông báo lỗi cho người dùng: **tiếng Việt**. Thuật ngữ kèm tiếng Anh trong ngoặc.
- Tên biến, tên hàm: tiếng Việt không dấu khi nó thuộc miền sản phẩm (`danhSachThe`, `dangTai`,
  `laAnDanh`), tiếng Anh khi nó là khái niệm kỹ thuật chung (`useState`, `queryClient`, `session`).
  Đừng trộn nửa vời trong cùng một cái tên.

## Luật không được phá

1. **Không viết mã màu trong component.** Mọi màu, phông, bo góc, bóng đổ nằm ở
   `src/styles/index.css` trong block `@theme`. Dùng class token: `bg-kem-hong`,
   `text-ca-cao-nhat`, `rounded-the`, `shadow-mem`.
2. **Thêm bảng database là phải bật RLS.** Mọi bảng cần
   `alter table ... enable row level security` và một policy `auth.uid() = user_id`.
   Quên là dữ liệu người dùng mở cho bất kỳ ai có anon key.
3. **Nội dung bài học không vào database.** Nội dung là `content/*.md`. Database chỉ giữ
   dữ liệu của người dùng.
4. **`service_role` key không bao giờ vào repo** hay vào biến `VITE_*`. Key đó bỏ qua RLS.
5. **Không commit vào `main`.** Mỗi thay đổi một branch, một pull request, xem bản preview
   của Vercel rồi mới merge.
6. **`journal_entries` là dữ liệu nhạy cảm.** Không analytics, không log nội dung, không gửi
   ra dịch vụ ngoài. Người dùng xoá tài khoản là xoá sạch.
7. **Tôn trọng `prefers-reduced-motion`.** Đã xử lý ở `index.css`; đừng viết animation bỏ qua nó.
8. **Số liệu nghiên cứu phải có nguồn đã mở thật.** Không bao giờ bịa con số hay tên nghiên cứu
   trong nội dung bài học. Thiếu nguồn thì ghi là thiếu, đừng điền tạm.

## Quy ước code

- Mobile-first. Thiết kế cho màn hình 375px trước, rồi mới nới ra.
- Vùng chạm tối thiểu 44px. Tương phản chữ tối thiểu 4.5:1.
- Mỗi route một file trong `src/pages/`. Mỗi tính năng một thư mục trong `src/features/`.
- Dùng `@/` cho import nội bộ: `import { supabase } from '@/lib/supabase'`.
- Server state qua TanStack Query, không tự viết `useEffect` + `fetch`.
- Không thêm thư viện mới nếu chưa bàn. Mỗi thư viện là một thứ partner phải sống cùng.

## Lệnh

```bash
npm run dev            # chạy local, mở http://localhost:5173
npm run dev:dienthoai  # mở được từ điện thoại cùng wifi
npm run typecheck      # kiểm tra kiểu
npm test               # chạy test
npm run build          # thử build như khi deploy
npm run db:push        # đẩy migration lên Supabase
```

## Khi nào phải hỏi lại người dùng

- Trước khi thêm thư viện mới hoặc đổi stack.
- Trước khi sửa `supabase/migrations/` đã chạy trên database thật (viết migration mới, đừng sửa file cũ).
- Trước khi đổi bảng màu hay khuôn bài học — đó là quyết định sản phẩm, đã chốt qua nhiều buổi bàn.
- Khi nội dung bài học thiếu số liệu hoặc nguồn. Đừng tự điền.
