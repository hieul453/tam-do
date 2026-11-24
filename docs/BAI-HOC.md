# Bài học

Chép lại từ vòng POC đầu tiên (M1→M5, tháng 11/2026). Mỗi mục dưới đây đã **mất
thời gian thật** để tìm ra, và cái nào cũng sẽ cắn lại nếu dựng app mới trên
cùng bộ công cụ này.

Sắp theo mức độ dễ mất thời gian, không theo chủ đề.

---

## Những cái bẫy im lặng

Nhóm này nguy hiểm nhất: không có thông báo lỗi, chỉ có kết quả sai.

### Sandbox nuốt file ghi ngoài thư mục dự án

Tool Bash của Claude chạy trong sandbox. Ghi file ra ngoài thư mục dự án có thể
chỉ nằm trong lớp phủ tạm — **đọc lại bằng chính tool đó vẫn thấy file**, nên
rất dễ tưởng đã thành công. Đã gặp thật với `%LOCALAPPDATA%`.

Cần tạo file ngoài dự án thì dựng trong dự án trước, rồi chép sang bằng terminal
thật của người dùng, rồi **kiểm chứng lại bằng terminal thật**.

### `import * as` từ thư viện icon kéo cả thư viện vào bundle

```ts
import * as Icons from 'lucide-react' // ← một dòng, hơn nửa bundle
const Co = Icons[tenIcon]
```

Tra icon theo tên thì tiện, nhưng bundler không biết tên nào sẽ được dùng nên
giữ hết ~1500 icon. Bỏ dòng này: **399 kB gzip còn 189 kB**.

Thay bằng một bảng liệt kê tên một, và một bài kiểm canh để thêm icon mà quên
khai báo thì CI đỏ.

### Zod đi vào bản production dù chỉ dùng ở dev

```ts
import { Schema } from './schema'
if (import.meta.env.DEV) Schema.safeParse(x) // ← Zod vẫn vào bundle
```

Import ở đầu file thì module được nạp bất kể nhánh nào chạy. Đổi sang
`await import('./schema')` **bên trong** nhánh DEV: 425 kB còn 399 kB.

### Sửa migration rồi quên chạy lại

Thêm `default null` cho một tham số trong file `.sql` nhưng chưa chạy lên
database. PostgREST tìm hàm theo đúng bộ tham số nhận được, không thấy thì trả
**404** — và giao diện lúc đó vẫn báo "đã xong" vì nó không đợi xác nhận.

Hai bài học, và cái thứ hai quan trọng hơn:

1. Sửa migration là phải chạy lại.
2. **Không bao giờ báo "đã xong" trước khi database xác nhận.** Dấu tích, XP,
   mọi thứ. Thà chậm nửa giây còn hơn hiện một con số không có thật.

### `&&` sau `| tail` nuốt mã lỗi

```bash
npm run typecheck | tail -5 && echo "ok"   # ← luôn in "ok"
```

Mã thoát của pipeline là mã thoát của `tail`. Đã báo "typecheck xanh" trong khi
nó đỏ. Luôn bắt mã thoát riêng:

```bash
npm run typecheck > /tmp/tc.txt 2>&1; echo "TC=$?"
```

### CRLF làm hỏng việc sửa file bằng script

Script Node tìm-và-thay sẽ không khớp nếu file dùng CRLF mà chuỗi tìm dùng LF.
Không báo lỗi, chỉ là không thay gì cả. Luôn `.replace(/\r\n/g, '\n')` sau khi
đọc, và **kiểm tra chuỗi có tìm thấy không rồi mới thay**:

```js
if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 60))
```

---

## TypeScript 7 và Windows

- **TS 7 bỏ `baseUrl`.** Dùng `"paths": { "@/*": ["./src/*"] }`, không có
  `baseUrl`.
- **`typescript-eslint` chưa hỗ trợ TS 7** (peer range dừng ở `<6.1.0`). Dự án
  này không có ESLint; dựa vào `tsc --strict` và Prettier. Thử lại khi họ ra bản
  hỗ trợ.
- **`new URL(...).pathname` trả về `/D:/...` trên Windows** và làm hỏng mọi
  alias. Dùng `fileURLToPath`.

### PowerShell 5.1

- Đọc file UTF-8 **không có BOM** thành ANSI. Ghi file `.ps1` kèm BOM.
- **Tên biến không phân biệt hoa thường**: `foreach ($v in ...)` ghi đè lên `$V`
  đang giữ header Authorization. Lỗi nhận được là "missing authentication
  token", chẳng liên quan gì.
- Thân của phản hồi lỗi HTTP nằm ở `$_.ErrorDetails.Message`, không nằm ở
  response stream. Không biết chỗ này thì mọi lỗi 403 đều mù.
- `[CmdletBinding()]` và `[Parameter()]` làm script từ chối đầu vào qua
  pipeline. Bỏ cả hai, bắt `$input` ở cấp cao nhất.
- `ConvertTo-Json` của một object rỗng sinh ra thuộc tính có tên rỗng.

---

## Hạ tầng

### Vercel

- **`vercel.json` không nhận key lạ.** Kể cả `"//"` dùng làm chú thích cũng làm
  deploy đỏ với "should NOT have additional property".
- App single-page cần rewrite mọi đường dẫn về `index.html`, nếu không thì mở
  thẳng `/trang-nao-do` hay bấm F5 ra 404. **Bấm link trong app vẫn chạy**, nên
  lỗi này rất dễ lọt tới lúc demo.
- API: biến môi trường phải là `type: 'plain'`, `'encrypted'` trả 403. Và
  **đừng truyền `teamId`** — thêm vào là lời gọi đang chạy thành 404.
- Edge function chết ở **25 giây**.

### Supabase

- Personal access token **không tạo được project** (403) và không đọc được
  `/v1/organizations`, nhưng chạy được SQL, sửa auth config, đọc api-keys, xoá
  project.
- Chọn region theo độ trễ đo thật, đừng theo cảm giác. Đo từ Việt Nam:
  **Singapore 72ms, Tokyo 131ms**.
- Thêm bảng là phải bật RLS **và** một policy `auth.uid() = user_id`. Quên là
  bảng đó mở cho bất kỳ ai có anon key — mà anon key thì nằm sẵn trong bundle.
- Cách kiểm RLS đáng tin duy nhất là **tự tấn công bằng chính khoá anon công
  khai**: tạo hai người dùng ẩn danh thật, thử đọc và ghi chéo nhau.
- Hàm xoá dữ liệu phải là `security invoker` và mọi lệnh đều ràng `auth.uid()`.
  `security definer` thì một lỗi nhỏ ở mệnh đề `where` là xoá sạch của người
  khác.
- Chuỗi ngày và mọi thứ theo ngày: tính theo múi giờ của **người dùng**, lưu ở
  `profiles.timezone`. Tính theo UTC thì người học buổi tối ở Việt Nam mất chuỗi
  oan. Và chỉ server mới biết "hôm nay" là ngày nào — đừng để client tự tính.
- `NULL = date` ra `NULL`, không ra `false`. Bọc `coalesce(..., false)` trước
  khi trả về cho client.

### PWA và cái bẫy "chậm một nhịp"

Service worker lưu sẵn `index.html`, nên sau mỗi lần deploy, lần mở đầu tiên
vẫn nhận bundle cũ. Nghe `controllerchange` rồi tải lại một lần.

> Bản vá chỉ có hiệu lực **từ lần deploy kế tiếp**, vì nó nằm trong bundle mới.

Hiện mã commit ở đâu đó trong app (xem `vite.config.ts`) — chính nó đã lộ ra cái
bẫy này. Không có nó thì chỉ thấy "sửa rồi mà không đổi" và đoán mò.

### iOS

Không nhận SVG cho "thêm vào màn hình chính". Phải có PNG thật.

Xuất PNG từ SVG mà không cài thêm gì: vẽ lên canvas trong trình duyệt rồi POST
byte về `scripts/nhan-tep.mjs`. Canvas nén PNG ở mức thấp — nén lại bằng zlib
mức 9 thì **188 kB còn 25 kB**.

---

## Gemini (gói miễn phí)

- `gemini-2.5-flash` **không còn cấp cho tài khoản mới** (404). `gemini-4-*` trả
  429 (không có trong gói miễn phí).
- Gemini 3.x **mặc định bật "thinking"** và nó ăn hết ngân sách token đầu ra:
  đặt `maxOutputTokens: 700` mà chỉ nhận về 93 ký tự trong khi tốn 792 token.
  Phải đặt `thinkingConfig: { thinkingBudget: 0 }`.
- **Model đông không trả 503 ngay mà treo.** Đo thật: `gemini-3.8-flash` 120
  giây, `gemini-3.7-flash` 288 giây. Fallback xếp hàng tuần tự vì thế chết trước
  khi tới được model đang rảnh — và Edge function của Vercel chỉ có 25 giây.
- **Model nào rảnh đổi theo từng phút.** Cùng `gemini-3.6-flash`: lần đo đầu 7,3
  giây, lần sau treo quá 20 giây. Không thứ tự cố định nào đáng tin.

Cách đã chạy được: **gọi gối đầu**. Phóng model tốt nhất trước, cứ 2 giây chưa
ai trả lời thì phóng thêm một model, ai về trước thì lấy và huỷ phần còn lại;
nhớ model vừa thắng để lần sau thử trước. Đo 5 lượt với prompt thật: lượt nào
cũng đủ nội dung, quanh 10 giây; lượt sau còn 3 giây.

---

## Thiết kế

### Đo tương phản, đừng chốt bằng mắt

Vòng trước đặt luật "tương phản tối thiểu 4.5:1" ngay từ đầu rồi chốt màu bằng
mắt. Tới lúc đo thật thì **bảy token trượt**: bậc chữ mờ nhất chỉ 2,5:1, chữ
trắng trên màu nhấn 2,7:1.

Màu nhấn sáng (kiểu san hô, hồng, vàng) **không đỡ được chữ trắng**. Phải tách
hai sắc: một cho mảng trang trí, một đậm hơn cho mọi chỗ có chữ trắng đè lên.
Logo được WCAG miễn.

Đo bằng một đoạn chạy thẳng trong trình duyệt, so màu chữ với **nền thật** của
nó (đi ngược cây DOM tìm nền không trong suốt). Cẩn thận: trình duyệt hiện đại
trả màu dạng `oklab(...)` cho nền có alpha — bộ phân tích chỉ hiểu `rgb()` sẽ
đọc ra số vô nghĩa và báo lỗi giả.

### Hoạt ảnh viết bằng CSS

Khối `@media (prefers-reduced-motion: reduce)` trong CSS tắt giúp mọi animation
— không phải nhớ xử lý riêng ở từng chỗ, và bundle không nặng thêm. Hoạt ảnh
viết bằng JavaScript thì phải tự gọi `matchMedia` để kiểm.

### Âm thanh: tổng hợp, đừng đi tìm file

Vài nốt sine bằng Web Audio là đủ cho tiếng đúng/sai/hoàn thành. Không thêm byte
nào vào bundle, và không vướng giấy phép.

---

## Cách làm việc

- **Luôn kiểm bằng trình duyệt thật, không tin typecheck.** Lỗi đắt nhất vòng
  trước (giao diện báo "+15 XP" mà không có gì được lưu) chỉ lộ ra khi mở trang
  và bấm thật.
- `IntersectionObserver` gắn sẵn **không bắn** khi cuộn bằng
  `window.scrollTo()` trong môi trường kiểm tự động, nhưng bắn bình thường với
  thao tác cuộn thật. Dễ tưởng là lỗi sản phẩm.
- Viết bài kiểm cho đúng **hình dạng dữ liệu mà client thật sự gửi**, không chỉ
  cho hình dạng lý tưởng. Lỗi 404 ở trên đã lọt vì bộ kiểm luôn truyền đủ tham
  số, còn client thì không.
- Có bài kiểm canh những **hằng số phải khớp giữa client và database**. Chúng
  trôi khỏi nhau lúc nào không biết, và người dùng là người phát hiện.
