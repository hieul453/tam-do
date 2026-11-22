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

[0001_khoi_tao.sql](supabase/migrations/0001_khoi_tao.sql) — 8 bảng.
[0002_tien_do_va_co_che.sql](supabase/migrations/0002_tien_do_va_co_che.sql) — thêm bảng
`tien_do_phan` và các cột XP / chuỗi / tim. RLS bật trên cả 9 bảng, mỗi bảng một policy
`auth.uid() = user_id`.

> Thêm bảng mà quên `enable row level security` thì bảng đó mở cho bất kỳ ai có anon key.

Hai cái bẫy đã xử lý:

- **Chuỗi ngày và múi giờ.** Tính theo UTC làm người học buổi tối ở Việt Nam mất chuỗi.
  `profiles.timezone` mặc định `Asia/Ho_Chi_Minh`, `card_reviews.due_on` là `date`.
- **Dữ liệu nhạy cảm.** Nhật ký và câu chuyện kể cho AI: không analytics, `on delete cascade`.

0001 được viết cho mô hình nội dung cũ (`lesson_progress.tier` dùng bộ giá trị cũ), nên
0002 thêm bảng `tien_do_phan` riêng thay vì sửa bảng đã chạy trên database thật.

### Mọi số liệu đi qua một hàm

`so_lieu_hoc()` trả về chuỗi ngày, tim, XP hôm nay, mục tiêu và danh sách phần đã xong
trong một lời gọi. `ghi_nhan_phien()` làm cả ba việc (đánh dấu phần xong, cộng XP hôm
nay, cập nhật chuỗi và tim) rồi trả về chính số liệu mới đó, nên ghi xong không cần đọc lại.

Gộp lại vì **chỉ server biết "hôm nay" là ngày nào** theo múi giờ của người dùng. Để client
tự tính ngày rồi truy vấn ba bảng là mở đường cho chuỗi ngày bị mất oan.

Tim do client gửi (`p_tim_con_lai`) chứ không để server tự trừ theo số câu sai: phiên học
cho nạp lại tim giữa đường nên hai bên sẽ lệch — người học thấy 5 tim trong bài mà thanh
bên hiện 0. Bài đọc bỏ trống tham số này.

> Tham số đó có `default null`. Sửa migration mà quên chạy lại thì PostgREST trả 404 cho
> lời gọi thiếu tham số. Đã mất một vòng mới tìm ra, vì giao diện lúc đó vẫn báo "đã xong"
> — lý do bây giờ dấu tích chỉ bật sau khi database xác nhận.

Kiểm bằng cách đánh thẳng vào database bằng chính khoá anon công khai:
`node .git/sb-07-test-rls-m3.mjs` — 25 phép thử, gồm cả RLS lẫn các ca biên của chuỗi ngày.

## Đăng nhập

Vào là dùng ngay: `signInAnonymously()` cho `user_id` thật. Muốn giữ tiến độ thì
`linkIdentity('google')` — **`user_id` không đổi** nên không phải chuyển dữ liệu.

Redirect URI trỏ về Supabase, không phải Vercel:
`https://crbpqbjdvakhwmoybicw.supabase.co/auth/v1/callback`

## AI ở tầng Áp dụng

Google Gemini, gói miễn phí. Những gì đã đo được và phải nhớ:

- `gemini-2.5-flash` **không còn cấp cho tài khoản mới** (404). `gemini-4-*` trả 429.
- Gemini 3.x **mặc định có "thinking"**, ăn hết ngân sách token đầu ra. Đặt
  `maxOutputTokens: 700` mà chỉ nhận về 93 ký tự trong khi tốn 792 token. Phải đặt
  `thinkingConfig: { thinkingBudget: 0 }`, không thì câu trả lời cụt giữa chừng.
- **Model đông không trả 503 ngay mà treo.** Đo thật: `gemini-3.8-flash` 120 giây,
  `gemini-3.7-flash` 288 giây. Fallback xếp hàng tuần tự vì thế chết trước khi tới được
  model đang rảnh — Edge function của Vercel chỉ có 25 giây, và nó đã 504 thật.
- **Model nào rảnh đổi theo từng phút.** Cùng `gemini-3.6-flash`: lần đo đầu 7,3 giây,
  lần sau treo quá 20 giây. Không thứ tự cố định nào đáng tin.

Vì hai điều cuối, [api/goi-y.ts](api/goi-y.ts) **gọi gối đầu**: phóng model tốt nhất
trước, cứ 2 giây chưa ai trả lời thì phóng thêm một model nữa, ai về trước thì lấy và huỷ
phần còn lại; model vừa thắng được nhớ lại để lần sau thử trước. Đo 5 lượt liên tiếp với
prompt thật: lượt nào cũng có đủ 3 gợi ý, quanh 10 giây.
Đo lại bất cứ lúc nào: `node .git/gemini-hedge-test.mjs`.

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
| **M2** ✅ | Ba hướng tiếp cận: bài tập Nhanh, bài đọc Đào sâu, Áp dụng + AI |
| **M3** ✅ | Cơ chế: XP, chuỗi ngày, tim, mục tiêu ngày, màn tổng kết phiên |
| **M4** | Hoàn thiện demo: onboarding, âm thanh, hoạt ảnh, trạng thái rỗng |

## Backlog

Những thứ chưa quyết được, gom lại thay vì chặn tiến độ:

- Tên app chính thức — "Tâm Đồ" là tên tạm từ tài liệu gốc.
- Chế độ tối.
- Ghi dữ liệu khi mất mạng.
- Sentry — nên có trước khi demo thật.
- Âm thanh phản hồi: cần tìm nguồn miễn phí có giấy phép rõ ràng.
- Làm lại một phần vẫn được XP đầy đủ. Duolingo giảm XP cho lượt làm lại; giảm ở đây thì
  màn tổng kết (tính XP phía client) sẽ nói khác database, nên để nguyên và ghi lại.
- Trợ lý AI mất khoảng 10 giây cho gợi ý đầu tiên vì các model tốt đang đông. Chấp nhận
  được cho bản pilot; muốn nhanh hơn thì phải trả tiền hạn mức.
