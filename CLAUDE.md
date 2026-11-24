# CLAUDE.md

> Bộ não chung của dự án. Đọc trước khi sửa bất cứ gì.
>
> - Những cái bẫy đã mất thời gian thật để tìm ra: [docs/BAI-HOC.md](docs/BAI-HOC.md)
> - Cài đặt, cấp quyền, token: [docs/SETUP.md](docs/SETUP.md)

## Repo này đang ở đâu

Vòng POC đầu tiên (một app học tâm lý học kiểu Duolingo) đã xong và đã được dọn
đi. Còn lại là **bộ khung** đã chạy thật: toolchain, CI, Supabase, Vercel, kho
token, và tập bài học ở trên.

Lịch sử git giữ nguyên mọi thứ. Muốn xem lại bản cũ:

```bash
git log --oneline            # M1 → M5
git show <commit>:<file>
```

Chưa quyết định sẽ dựng gì tiếp. **Phần mô tả sản phẩm ở dưới sẽ được viết lại
khi có hướng mới** — đừng suy đoán rồi làm theo suy đoán đó.

## Stack

Đã chạy thật và hợp nhau, giữ lại vì tìm được bộ tương thích với TypeScript 7
không dễ:

| | |
|---|---|
| Vite · React · TypeScript 7 | `npm run dev` |
| Tailwind v4 | tokens trong `@theme` ở `src/styles/index.css`, không có file config |
| Prettier · vitest | `npm run format`, `npm test` |
| Supabase | Postgres + Auth + RLS |
| Vercel | hosting, preview mỗi PR, serverless function |

`package.json` còn giữ `@supabase/supabase-js`, `@tanstack/react-query`,
`react-router`, `zod`, `lucide-react` — chưa dùng tới, nhưng đây là bộ phiên bản
đã kiểm chứng chạy được với TS 7. Không cần thì gỡ.

## Lệnh

```bash
npm run dev            # http://localhost:5173
npm run dev:dienthoai  # mở được từ điện thoại cùng wifi
npm run typecheck
npm test
npm run format
npm run build

node scripts/sql.mjs <file.sql>   # chạy SQL trên Supabase
node scripts/nhan-tep.mjs         # cổng nhận tệp từ trình duyệt
```

## Luật không được phá

Rút từ vòng trước; mỗi cái đều có một lần vấp đứng sau nó.

1. **Không viết mã màu trong component.** Token ở `src/styles/index.css` block
   `@theme`.
2. **Màu phải mang nghĩa**, không để trang trí. Thấy mình tô màu cho đẹp là sai
   hướng.
3. **Thêm bảng database là phải bật RLS** và một policy `auth.uid() = user_id`.
   Sửa migration rồi thì **chạy lại**, và kiểm RLS bằng cách tự tấn công bằng
   chính khoá anon công khai.
4. **Khoá bí mật không bao giờ vào biến `VITE_*`.** Mọi biến `VITE_*` đều lộ
   trong bundle. Khoá AI gọi qua serverless function.
5. **Không commit vào `main`.** Mỗi thay đổi một nhánh, một pull request, CI
   xanh rồi mới merge.
6. **Dữ liệu riêng tư của người dùng là dữ liệu nhạy cảm.** Không log nội dung,
   không analytics, không gửi đi đâu ngoài lời gọi đang phục vụ chính người đó.
7. **Tôn trọng `prefers-reduced-motion`.** Đã xử lý ở `index.css`; hoạt ảnh bằng
   JavaScript thì phải tự kiểm `matchMedia`.
8. **Số liệu dẫn ra phải có nguồn mở được.** Không bịa con số, không bịa tên
   nghiên cứu. Thiếu nguồn thì ghi là thiếu.
9. **Vùng chạm tối thiểu 44px, tương phản chữ tối thiểu 4.5:1** — và **đo**,
   đừng chốt bằng mắt. Vòng trước chốt bằng mắt, tới lúc đo thì bảy token trượt.
10. **Không báo "đã xong" trước khi database xác nhận.** Đã vấp: lời gọi hỏng mà
    màn hình vẫn báo "+15 XP".
11. **Không `import * as` từ thư viện icon.** Một dòng từng chiếm hơn nửa bundle.

## Ngôn ngữ

- Giao diện và nội dung: **tiếng Việt**. Thuật ngữ kèm tiếng Anh trong ngoặc khi
  cần.
- Tên biến, hàm: tiếng Việt không dấu khi thuộc miền sản phẩm (`danhSachThe`,
  `laAnDanh`, `trangThai`), tiếng Anh khi là khái niệm kỹ thuật chung
  (`useState`, `queryClient`). Không trộn nửa vời trong cùng một tên.

## Quy ước code

- Mobile-first: thiết kế cho 375px trước, rồi mới nới ra.
- Mỗi tính năng một thư mục trong `src/features/`. Component dùng chung ở
  `src/components/`.
- Dùng `@/` cho import nội bộ.
- Server state qua TanStack Query, không tự viết `useEffect` + `fetch`.
- Chạy `npm run format` trước khi commit; CI kiểm định dạng.
- **Không thêm thư viện mới nếu chưa bàn.**

**Chưa có ESLint** — TypeScript 7 quá mới, `typescript-eslint` chưa hỗ trợ (peer
range dừng ở `<6.1.0`). Dựa vào `tsc --strict` và Prettier. Thử lại khi họ ra
bản hỗ trợ TS 7.

## Khi nào phải hỏi lại

- Trước khi thêm thư viện hoặc đổi stack.
- Trước khi sửa migration đã chạy trên database thật — viết migration mới.
- Trước khi xoá dữ liệu hay gỡ thứ gì đang chạy.
- Khi nội dung thiếu nguồn. Đừng tự điền.
