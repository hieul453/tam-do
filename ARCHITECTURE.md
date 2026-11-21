# Kiến trúc Tâm Đồ

> Tài liệu kỹ thuật. Quyết định gì, vì sao chọn vậy, và bỏ gì đi.
> Spec sản phẩm (nội dung, trải nghiệm, màu sắc, linh vật) nằm ở [docs/SPEC-SAN-PHAM.md](docs/SPEC-SAN-PHAM.md).

---

## Ràng buộc chi phối mọi lựa chọn

Ràng buộc mạnh nhất **không** phải "app giống Duolingo". Nó là: **một người non-tech cũng vibe code vào dự án này.**

Hệ quả — những thứ bị loại bỏ ngay từ đầu:

| Loại bỏ | Vì sao |
|---|---|
| Backend tự viết | Thêm một thứ phải vận hành, debug, deploy |
| Monorepo | Hai thư mục app là hai lần nhầm chỗ |
| Docker, emulator local | Partner sẽ không bao giờ chạy được |
| Bước build thủ công | Pipeline nào cần người gõ lệnh thì pipeline đó sẽ chết |
| Server-side rendering | App nằm sau đăng nhập, SEO không mua được gì |

Và những thứ bắt buộc phải có:

- **Một repo, một lệnh chạy** (`npm run dev`).
- **Mỗi pull request có một URL xem trước.** Partner mở link trên điện thoại, thấy đúng thay đổi của mình, không cài gì. Đây là lý do chọn Vercel, không phải vì nó nhanh.
- **CI chặn merge khi code hỏng**, để không ai — kể cả AI — làm vỡ bản live.

---

## Stack

| Lớp | Chọn | Version khi khởi tạo |
|---|---|---|
| Build | Vite | 8.3 |
| UI | React + TypeScript | 19.3 / TS 7.0 |
| Routing | React Router (chế độ library) | 8.5 |
| Styling | Tailwind CSS v4 (`@theme` trong CSS, không file config) | 4.3 |
| Icon | lucide-react (icon nét, khớp "không dùng emoji trong giao diện thật") | 1.77 |
| Animation | motion | 14.14 |
| Server state | TanStack Query | 5.108 |
| Auth + Database | Supabase (Postgres + Auth + RLS) | js 2.119 |
| Validate dữ liệu | Zod | 4.6 |
| Markdown → HTML | marked | 18.2 |
| PWA | vite-plugin-pwa (Workbox) | 2.0 |
| Test | Vitest | 5.1 |
| Hosting | Vercel | — |

### Vì sao Vite SPA, không phải Next.js

Next.js có ranh giới server component / client component. Đó là **nguồn lỗi số một của code React do AI sinh ra**: code trông đúng, build qua, chạy mới vỡ, và thông báo lỗi khó hiểu với người không có nền tảng. Trong một dự án mà cả hai người đều vibe code, chi phí của loại lỗi đó cao hơn mọi thứ Next.js mang lại.

Vite SPA thì mọi file là client. Một mô hình duy nhất, không có ngoại lệ.

Đổi lại: không có SSR nên trang bài học không index được lên Google. Khi nào cần chia sẻ công khai cho cộng đồng (mục tiêu số 3 trong spec), làm một trang landing tĩnh riêng, không cần đổi app.

### Vì sao Supabase, không phải Firebase

Spec gốc chọn Firebase. Đổi sang Supabase vì ba điểm:

1. **Lịch ôn giãn cách là một câu SQL**: `select * from card_reviews where due_on <= today`. Trên Firestore phải tạo composite index và truy vấn vòng vo.
2. **Partner mở bảng ra xem được** dữ liệu của mình trong Table Editor. Firestore console trừu tượng hơn nhiều.
3. **RLS là SQL, đọc được và test được.** Firestore Security Rules là ngôn ngữ riêng, dễ viết sai mà không biết — rủi ro thật vì nhật ký áp dụng là dữ liệu nhạy cảm.

**Firebase hơn ở một điểm, và nó thật:** Firestore có offline persistence sẵn, Supabase không. Hiện chấp nhận đánh đổi này; khi cần offline sẽ làm cache + hàng đợi ghi ở phía client.

---

## Nội dung và dữ liệu nằm ở hai nơi khác nhau

Đây là quyết định kiến trúc quan trọng nhất.

```
NỘI DUNG (tĩnh, trong repo)          DỮ LIỆU NGƯỜI DÙNG (Postgres)
────────────────────────────         ──────────────────────────────
content/*.md                         profiles
   │  (build)                        lesson_progress
   ▼                                 card_reviews
src/content/generated/*.json         saved_cards
   │                                 notes
   ▼                                 journal_entries
ship cùng app                        daily_activity
                                     badges
```

**Nội dung không bao giờ vào database.** Lợi ích:

- Nội dung miễn phí vô hạn, không tốn lượt đọc database.
- Load tức thì, offline tự nhiên (service worker precache).
- Sửa nội dung là sửa file → có history git, review được qua pull request.
- Partner sửa `.md` mà không cần biết database là gì.

**Dữ liệu người dùng chỉ ở Postgres**, không có bảng nội dung nào, nên không có khoá ngoại giữa hai bên. `lesson_id` và `card_id` là `text`, trỏ tới id sinh từ markdown.

---

## Database

Schema: [supabase/migrations/0001_khoi_tao.sql](supabase/migrations/0001_khoi_tao.sql). 8 bảng.

**Row Level Security bật trên mọi bảng**, mỗi bảng đúng một policy: chỉ thao tác được trên dòng `user_id = auth.uid()`. Không bảng nào có policy đọc công khai.

> Thêm bảng mới mà quên `enable row level security` thì bảng đó mở cho bất kỳ ai có anon key. Đây là lỗi nguy hiểm nhất có thể xảy ra trong dự án này.

### Hai cái bẫy đã biết trước

**1. Chuỗi ngày và múi giờ.** Tính streak theo UTC sẽ làm người học buổi tối ở Việt Nam bị mất chuỗi (sau 7 giờ tối UTC đã sang ngày mới). Nên `profiles.timezone` mặc định `Asia/Ho_Chi_Minh`, và `card_reviews.due_on` là `date` chứ không phải `timestamptz` — "đến hạn hôm nay" là khái niệm theo ngày, không theo giờ.

**2. ID của thẻ phải ổn định.** `card_reviews.card_id` trỏ tới id sinh từ **vị trí** thẻ trong markdown (`tlhdc-06-06-c4`). Chèn thêm một thẻ vào giữa bài sẽ làm lệch lịch ôn của mọi thẻ phía sau.

Giai đoạn đầu chấp nhận được. Khi nội dung nhiều hơn vài chương thì phải thêm id tường minh vào markdown. **Đừng để quên cái này.**

---

## Luồng đăng nhập

Theo "phương án B" trong spec: dùng thử trước, đăng nhập sau.

```
Mở app lần đầu
   └─> signInAnonymously()      user_id thật, ghi thẳng vào Postgres
          │
          │  (muốn giữ tiến độ)
          ▼
       linkIdentity('google')   CÙNG user_id, không phải chuyển dữ liệu
```

Khác với phương án "lưu localStorage rồi đẩy lên tài khoản": ở đây không có bước migrate dữ liệu nào cả, vì `user_id` không đổi khi liên kết. Ít code hơn, ít chỗ sai hơn.

Code: [src/lib/auth.tsx](src/lib/auth.tsx).

---

## Bảo mật và riêng tư

- `anon key` **được thiết kế để nằm công khai** trong bundle frontend. An toàn đến từ RLS, không từ việc giấu key. Không cần lo khi thấy nó trong code đã build.
- `service_role` key **không bao giờ** xuất hiện trong repo hay trong biến môi trường của frontend. Key đó bỏ qua toàn bộ RLS.
- `journal_entries` là dữ liệu nhạy cảm: không analytics, không chia sẻ, không index ra dịch vụ ngoài. `on delete cascade` đảm bảo xoá tài khoản là xoá sạch.

---

## Những thứ cố tình chưa làm

| Chưa làm | Khi nào làm |
|---|---|
| Pipeline `content/*.md` → JSON | Khi bắt đầu làm trình đọc bài |
| 5 tab, bản đồ hành trình, onboarding | Khi bắt đầu làm tính năng |
| Chế độ tối | Spec có, nhưng để sau — làm nửa vời thì tệ hơn chưa làm |
| Offline ghi dữ liệu khi mất mạng | Khi có người dùng thật phàn nàn |
| Sentry | Nên có sớm, chỉ cần một DSN |

---

## Cấu trúc thư mục

```
content/            Nội dung bài học, markdown. Bản gốc duy nhất.
docs/               Spec sản phẩm và kế hoạch gốc
scripts/            Script build nội dung (chưa có)
supabase/migrations Schema database, chạy theo thứ tự số
src/
  components/ui/    Nút, thẻ, thanh tiến độ — bộ "gạch" dùng chung
  components/mascot Linh vật Não và Tim
  features/         Mỗi tính năng một thư mục
  lib/              supabase.ts, auth.tsx — hạ tầng
  pages/            Mỗi route một file
  styles/index.css  DESIGN TOKEN. Nguồn duy nhất cho màu và chữ.
```
