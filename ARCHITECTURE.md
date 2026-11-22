# Kiến trúc Tâm Đồ

> Quyết định gì, vì sao, và cố tình bỏ gì.
> Luật làm việc hằng ngày ở [CLAUDE.md](CLAUDE.md).

---

## Sản phẩm là gì

Một Duolingo cho tâm lý học. Điều đó định hình gần như mọi quyết định kỹ thuật bên dưới:
phiên học ngắn, phản hồi tức thì, tiến độ nhìn thấy được, và **hai bố cục khác nhau**
cho web và điện thoại.

Khác Duolingo ở chỗ mỗi Phần có ba hướng tiếp cận cùng một nội dung thay vì một bài duy nhất.

## Stack

| Lớp | Chọn | Version |
|---|---|---|
| Build | Vite | 8.3 |
| UI | React + TypeScript | 19.3 / TS 7.0 |
| Routing | React Router (library mode) | 8.5 |
| Styling | Tailwind v4 (`@theme` trong CSS, không file config) | 4.3 |
| Icon | lucide-react | 1.77 |
| Animation | motion | 14.14 |
| Server state | TanStack Query | 5.108 |
| Auth + DB | Supabase (Postgres + Auth + RLS) | js 2.119 |
| AI | Google Gemini, gói miễn phí | — |
| PWA | vite-plugin-pwa (Workbox) | 2.0 |
| Hosting | Vercel | — |

### Vì sao Vite SPA, không phải Next.js

Next.js có ranh giới server/client component — nguồn lỗi số một của code React do AI sinh ra:
code trông đúng, build qua, chạy mới vỡ. App này nằm sau đăng nhập nên SSR không mua được gì.

Đổi lại: không index được lên Google. Khi cần trang giới thiệu công khai thì làm landing
tĩnh riêng, không phải đổi app.

### Vì sao Supabase, không phải Firebase

Lịch ôn giãn cách là một câu SQL. RLS là SQL nên đọc và test được — quan trọng vì sẽ có
dữ liệu nhạy cảm. Đổi lại: Firestore có offline persistence sẵn, Supabase không.

---

## Hệ thiết kế

**Minimalism, nhưng màu phải mang nghĩa.** Nền trắng, viền mảnh thay bóng đổ, một họ chữ
duy nhất (Be Vietnam Pro) tạo tương phản bằng cân nặng. Màu chỉ xuất hiện khi nó báo một
trạng thái: đúng, sai, đã xong, đang khoá, hiện tại.

Thử nghiệm cho thấy điều này quan trọng hơn tưởng: bản đầu tiên tô màu nhấn cho mọi chặng
trên lộ trình, kết quả là ba chặng trông giống hệt nhau và mắt không biết nhìn đâu. Phân
bốn dáng (`xong` / `hien-tai` / `mo` / `khoa`) thì nhìn phát biết ngay mình đang ở đâu.

Token ở `src/styles/index.css`. Vay của Duolingo đúng một thứ ngoài bố cục: **nút khối có
"chân" dưới, bấm vào lún xuống** — trên màn cảm ứng không có phản hồi xúc giác, cái lún
xuống thay cho cảm giác bấm.

## Hai bố cục

| | |
|---|---|
| **Web ≥1024px** | điều hướng dọc trái · nội dung giữa · cột phải (số liệu, mục tiêu ngày, nhắc liên kết tài khoản) từ 1280px |
| **Mobile <1024px** | thanh số liệu mỏng trên · nội dung · tab ngang dưới |
| **Phiên học** | chiếm trọn màn hình ở cả hai khổ — không gì kéo người học ra khỏi bài |

Chuyển bằng CSS chứ không JS. Cái giá là cả hai thanh điều hướng đều nằm trong DOM; chấp
nhận được vì chúng rất nhẹ, và `display:none` đã loại chúng khỏi cây accessibility nên
trình đọc màn hình chỉ thấy đúng một.

## Nội dung

```
src/content/schema.ts        Zod + type, hợp đồng của nội dung
src/content/du-lieu/*.ts     nội dung thật
src/content/index.ts         gom lại, kiểm schema lúc chạy dev
```

Không dùng database, không parse markdown. Lý do bỏ pipeline markdown của bản trước: nội
dung của app này là **dữ liệu có cấu trúc** (bài tập, đáp án, lựa chọn), không phải văn
xuôi. Viết thẳng bằng TypeScript cho autocomplete, bắt lỗi lúc typecheck, và đổi nội dung
chỉ là sửa một file.

Bài tập là discriminated union: `the-lat`, `chon-mot`, `dung-sai`, `ghep-doi`, `dien-tu`,
`xep-thu-tu`. Thêm loại mới thì thêm một nhánh vào union, TypeScript sẽ chỉ ra mọi chỗ
cần xử lý.

## Database

[supabase/migrations/0001_khoi_tao.sql](supabase/migrations/0001_khoi_tao.sql) — 8 bảng,
RLS bật trên tất cả, mỗi bảng một policy `auth.uid() = user_id`.

> Thêm bảng mà quên `enable row level security` thì bảng đó mở cho bất kỳ ai có anon key.

Hai cái bẫy đã xử lý:

- **Chuỗi ngày và múi giờ.** Tính theo UTC làm người học buổi tối ở Việt Nam mất chuỗi.
  `profiles.timezone` mặc định `Asia/Ho_Chi_Minh`, `card_reviews.due_on` là `date`.
- **Dữ liệu nhạy cảm.** Nhật ký và câu chuyện kể cho AI: không analytics, `on delete cascade`.

Schema hiện được thiết kế cho mô hình nội dung cũ; sẽ viết migration mới ở M3 khi làm XP,
chuỗi ngày và tim.

## Đăng nhập

Vào là dùng ngay: `signInAnonymously()` cho `user_id` thật. Muốn giữ tiến độ thì
`linkIdentity('google')` — **`user_id` không đổi** nên không phải chuyển dữ liệu.

Redirect URI trỏ về Supabase, không phải Vercel:
`https://crbpqbjdvakhwmoybicw.supabase.co/auth/v1/callback`

## AI ở tầng Áp dụng

Google Gemini, gói miễn phí. Hai điều đã kiểm chứng và phải nhớ:

- `gemini-2.5-flash` **không còn cấp cho tài khoản mới**. Dùng `gemini-3.8-flash`.
- Gemini 3.x **mặc định có "thinking"**, ăn hết ngân sách token đầu ra. Đặt
  `maxOutputTokens: 700` mà chỉ nhận về 93 ký tự trong khi tốn 792 token. Phải cấu hình
  `thinkingConfig` hoặc nâng hẳn hạn mức, không thì câu trả lời cụt giữa chừng.

Khoá gọi qua serverless function của Vercel, **không bao giờ** đặt vào biến `VITE_*`.

## vercel.json

App là single-page nên cần rewrite mọi đường dẫn về `index.html`; không có nó thì mở thẳng
`/toi` hay bấm F5 sẽ ra 404 của Vercel. Bấm link trong app vẫn chạy nên lỗi này rất dễ lọt.

> `vercel.json` không nhận key lạ. Kể cả `"//"` dùng làm chú thích cũng làm deploy đỏ.

## PWA và cái bẫy "chậm một nhịp"

Service worker lưu sẵn `index.html`, nên sau mỗi lần deploy lần mở đầu tiên vẫn nhận bundle
cũ. Đã gặp thật. Xử lý ở [src/lib/tu-cap-nhat.ts](src/lib/tu-cap-nhat.ts): nghe
`controllerchange` rồi tải lại một lần.

> Bản vá chỉ có hiệu lực **từ lần deploy kế tiếp**, vì nó nằm trong bundle mới.
> Link preview của pull request không dính bẫy này — mỗi nhánh một tên miền riêng.

## Lộ trình

| | |
|---|---|
| **M1** ✅ | Hệ thiết kế · hai bố cục · màn hình lộ trình · màn chọn hướng tiếp cận |
| **M2** | Ba hướng tiếp cận: bài tập Nhanh, bài đọc Đào sâu, Áp dụng + AI |
| **M3** | Cơ chế: XP, chuỗi ngày, tim, mục tiêu ngày, màn tổng kết phiên |
| **M4** | Hoàn thiện demo: onboarding, âm thanh, hoạt ảnh, trạng thái rỗng |

## Backlog

Những thứ chưa quyết được, gom lại thay vì chặn tiến độ:

- Tên app chính thức — "Tâm Đồ" là tên tạm từ tài liệu gốc.
- Chế độ tối.
- Ghi dữ liệu khi mất mạng.
- Sentry — nên có trước khi demo thật.
- Âm thanh phản hồi: cần tìm nguồn miễn phí có giấy phép rõ ràng.
