# Linh vật Não và Tim — bản dịch sang ngôn ngữ thiết kế

> Tài liệu này **không vẽ gì cả**. Nó dịch các yêu cầu đã nêu sang đúng thuật
> ngữ ngành thiết kế, và liệt kê những hiện vật (artefact) phải có để đạt được
> từng yêu cầu — kèm chỗ nào ngành thiết kế **có** cơ chế tương đương với code,
> chỗ nào **không có** và phải chấp nhận.

> Prompt đặt hàng, chép thẳng đưa cho AI khác:
> [PROMPT-LINH-VAT.md](PROMPT-LINH-VAT.md).

## 0. Vì sao phải dịch

Yêu cầu gốc viết bằng tiếng lập trình: *tùy biến*, *reuse*, *đổi phụ kiện chéo*,
*mở rộng*. Ngành thiết kế có đủ các cơ chế đó, nhưng chúng **không nằm ở nét
vẽ** — chúng nằm ở **cấu trúc file**. Hoạ sĩ vẽ mảnh; công cụ lo phần lắp ghép.

Nói cách khác: một file PNG đẹp thì không tái dùng được, còn một file Figma
hoặc một file rig cùng hình đó thì tái dùng được — vì nó có **thành phần, thuộc
tính và điểm gắn**.

## 1. Bảng dịch: khái niệm code ↔ cơ chế thiết kế

| Trong code | Tên bên thiết kế | Sống ở file nào |
|---|---|---|
| interface, đặc tả | **model sheet** + **style guide** (gộp lại gọi là *character bible*) | tài liệu + trang Figma |
| unit test | **on-model check**, bảng **do / don't** | checklist khi duyệt |
| hàm có tham số | **component** + **component property** | Figma |
| tham số kiểu enum | **variant property** (`tuThe = dung \| nhay \| chay`) | Figma |
| tiêm phụ thuộc, slot | **instance-swap property**; trong rig gọi là **slot + attachment** | Figma / Rive / Spine |
| đổi nguyên một bộ cài đặt | **skin** (Spine) hoặc **nested artboard** (Rive) | rig |
| kế thừa | **main component → nested instance** | Figma |
| hằng số có tên, biến theme | **design token** / **Figma variable** có **mode** sáng–tối | tokens + CSS |
| phương thức | **animation clip** (một action tái dùng được) | rig |
| máy trạng thái | **state machine** + **inputs** (Rive) | `.riv` |
| build target | **export preset**: SVG, `.riv`, Lottie, PNG @2x/@3x | pipeline xuất file |
| phiên bản gói thư viện | **published library version** | Figma library |
| **"điểm neo" tôi tự nghĩ ra ở vòng trước** | đã có tên sẵn: **attachment point / slot / bone** | rig |

Dòng cuối đáng chú ý: ý tưởng điểm neo không sai, chỉ là hiện thực sai chỗ.
Ngành thiết kế đã có cơ chế đó từ lâu, và có công cụ chạy nó lúc runtime.

---

## 2. Dịch từng yêu cầu

### 2.1 "Đúng concept trong ảnh, có DNA Én Comics + minimalism"

**Tiếng thiết kế:** *art direction* viết thành **style guide**, trong đó "DNA"
là tập **bất biến** (invariant) — những thứ đổi là mất nhận diện.

Bất biến phải viết ra thành chữ, không để ngầm hiểu:

| Hạng mục | Luật |
|---|---|
| Khối dựng hình (construction) | Não = khối nhiều bướu; Tim = khối tim hai thuỳ. **Đầu chính là thân** — không cổ, không mình riêng. |
| Nét (line treatment) | Một độ dày duy nhất, mực đen, viền kín, **không** gradient, **không** nét nhiều màu. |
| Màu | Bệt tuyệt đối (flat), không chuyển sắc, không bóng mềm trong hình. |
| Chi (limbs) | **Rubber hose**: que đen không khớp; bàn tay là ba gạch ngắn; bàn chân là một gạch. |
| Mắt | Lòng trắng to, con ngươi đặc, không highlight. |
| Nền | Giấy kem; bóng đổ là một ê-líp bệt. |

**Minimalism ở đây là luật trừ**, nên phải viết cả danh sách *không được vẽ*:
má hồng, highlight bóng, vân nền, viền ngoài màu khác đen, đổ bóng mềm, hiệu
ứng 3D.

**Hiện vật cần có:** style guide một trang + **off-model sheet** — vẽ sẵn vài
bản sai và chú thích sai chỗ nào. Đây là cách xưởng phim giữ nhân vật đúng mẫu.

### 2.2 "AI nào vẽ cũng phải ra đúng hai nhân vật"

**Tiếng thiết kế:** giữ **on-model**. Có bốn mức bảo đảm, từ yếu tới mạnh:

| Mức | Cơ chế | Bảo đảm được gì |
|---|---|---|
| a | Prompt bằng chữ | Gần như không. Chữ không ép được hình. |
| b | **Model sheet làm ảnh tham chiếu** + tính năng *character reference* / *style reference* của công cụ | Khá giống, vẫn trôi |
| c | **LoRA / fine-tune riêng cho nhân vật** | Giống cao, vẫn trôi theo thời gian |
| d | **Vector master + rig**: không sinh lại nữa, chỉ **lắp lại** | Tuyệt đối |

Nói thẳng: **chỉ mức (d) là bảo đảm thật.** (a)–(c) là *xác suất cao* cộng với
một **cổng duyệt**. Cổng duyệt cũng là một hiện vật: checklist so với model
sheet, chấm bằng số đo chứ không bằng mắt.

**Hiện vật cần có:** model sheet, **turnaround** (chính diện / ba-phần-tư /
nghiêng / sau), **proportion chart** tính theo đơn vị đầu, bảng màu có mã,
bảng do / don't, checklist duyệt.

### 2.3 "Mở rộng sang animation, truyện tranh, video, short"

**Tiếng thiết kế:** cần **rig** (còn gọi là *puppet*, *armature*) — bộ xương có
điểm gắn, biến nhân vật tĩnh thành nhân vật điều khiển được.

Kèm theo:

- **Action library** — thư viện clip tái dùng: vẫy tay, nhảy, chạy, đập tay,
  gật đầu. Đây chính là "reuse action".
- **Mouth chart (viseme set)** — bộ hình miệng cho lồng tiếng. Chỉ cần nếu định
  làm video có thoại.
- **Emanata** — tên gọi chính thức của ký hiệu truyện tranh quanh nhân vật:
  giọt mồ hôi, vạch tốc độ, dấu chấm than, tim bay. Gom thành một **effects
  library** dùng chung cho cả hai nhân vật.
- Truyện tranh còn cần **góc nhìn** (nên mới cần turnaround), **bảng bàn tay**,
  và **bố cục khung**.

### 2.4 "Web responsive bây giờ, Android/iOS sau"

**Tiếng thiết kế:** **asset pipeline** + **format strategy** + hệ co giãn.

| Dùng vào việc gì | Định dạng | Chạy được ở đâu |
|---|---|---|
| Hình tĩnh | **SVG** (vector master) | mọi nơi, mọi kích thước |
| Hoạt hoạ trong app | **`.riv` (Rive)** hoặc **Lottie `.json`** | web, iOS, Android, React Native — cùng một file |
| Dự phòng | PNG @1x/@2x/@3x | khi không chạy được vector |
| Video / short | xuất từ rig ra chuỗi hình hoặc video | dựng phim |

Phần "responsive" có tên riêng: **detail reduction ladder** (bậc rút gọn chi
tiết). Phải quy định trước: cỡ nào bỏ phụ kiện, cỡ nào bỏ tay chân, cỡ nhỏ nhất
còn lại gì — kèm **kích thước tối thiểu** và **khoảng trống quanh** (clear
space). Luật này giống hệt hệ logo co giãn.

### 2.5 "Dùng đơn lẻ hoặc tương tác với nhau"

**Tiếng thiết kế:** phân biệt **single pose** và **two-shot** (cảnh hai nhân
vật), cộng **staging rules**.

Luật phải chốt, nếu không mỗi lần ghép lại lệch:

- **Size relationship** — Não cao hơn hay thấp hơn Tim, hơn bao nhiêu.
- **Baseline** — hai nhân vật đứng trên cùng một đường chân.
- **Eyeline** — khi quay vào nhau thì mắt nhìn đúng tầm.
- **Điểm chạm** và **thứ tự lớp** (z-order) khi tay chạm tay.

**Hiện vật cần có:** **two-shot sheet** + **relationship chart**.

### 2.6 "Mỗi mascot có bộ phụ kiện bám đặc tính"

**Tiếng thiết kế:** **prop library** (hoặc *wardrobe*), chia nhóm theo **nghĩa**
chứ không theo hình.

Ràng buộc "bám đặc tính" là một **design principle** phải viết thành câu:
*phụ kiện phải là dụng cụ của lý trí, hoặc dụng cụ của cảm xúc.*

| | Dụng cụ của… | Ví dụ |
|---|---|---|
| **Não** | lý trí, đo đạc, ghi chép | kính, bút chì, kính lúp, sổ tay, thước |
| **Tim** | cảm xúc, chăm sóc, kết nối | tai nghe, khăn quàng, băng dán, ly ấm, trái tim nhỏ |

**Hiện vật cần có:** prop sheet — mỗi món vẽ cùng một góc, cùng tỉ lệ, **có
đánh dấu điểm gắn**.

### 2.7 "Tùy biến cao: đổi phụ kiện chéo, reuse action"

Đây là yêu cầu trung tâm, và là chỗ ngành thiết kế khớp với code gần nhất.

**Trong Figma (hình tĩnh):**

- Nhân vật là một **main component**.
- Biểu cảm và tư thế là **variant property** — chọn từ danh sách, đúng như enum.
- Phụ kiện là **instance-swap property** — một ô trống, cắm kính hay cắm tai
  nghe vào đều được. **Đây chính là "đổi phụ kiện chéo".**
- Màu là **variable** có **mode**, nên đổi sáng/tối là bật một công tắc.

**Trong rig (hoạt hoạ):**

- **Slot + attachment**: mỗi vị trí trên nhân vật là một slot, mỗi phụ kiện là
  một attachment cắm vào slot đó.
- **Skin**: đổi nguyên một bộ attachment cùng lúc.
- **Shared skeleton**: nếu hai nhân vật dùng **chung một bộ xương và chung tên
  slot**, thì mọi clip animation viết một lần chạy được cho cả hai.

> **Luật bắt buộc, viết vào bible:** hai nhân vật phải **khai báo cùng một bộ
> tên điểm gắn** — `mat-trai`, `mat-phai`, `tai-trai`, `tai-phai`, `dinh-dau`,
> `mieng`, `vai-trai`, `vai-phai`, `hong-trai`, `hong-phai`. Giống hệt hai lớp
> cùng cài một interface. Không có luật này thì không đổi chéo được gì, và
> không clip nào dùng chung được.

### 2.8 "Hoạt hoạ vui trong app để tăng tương tác"

**Tiếng thiết kế:** **motion design language** — bảng quy định chuyển động:

- **Timing & easing** chuẩn: bao nhiêu mili giây, đường cong nào.
- Nguyên tắc hoạt hoạ dùng tới đâu: squash & stretch, anticipation,
  follow-through — vừa đủ, không thành phim hoạt hình.
- **Reaction library** — thư viện phản ứng ngắn gắn với sự kiện trong app.
- **Emanata** dùng chung với mục 2.3.

Ràng buộc từ dự án: luật 7 trong `CLAUDE.md` — phải có bản rút gọn cho
`prefers-reduced-motion`. Trong Rive đó là một input của state machine; trong
Lottie là một clip tĩnh thay thế.

### 2.9 "Hoạ sĩ thật nhận tài nguyên về là dùng được ngay"

**Tiếng thiết kế:** **design handoff** — bàn giao đúng chuẩn, không bắt người
nhận học thêm thứ gì của riêng dự án này.

Bốn luật bàn giao:

1. **Chỉ dùng định dạng phổ thông, mở được bằng công cụ thường dùng.**

   | Loại | Định dạng bàn giao | Mở được bằng |
   |---|---|---|
   | Vector master | **SVG** (chính) + **PDF** hoặc **AI** (kèm theo) | Illustrator, Figma, Affinity Designer, Inkscape, Procreate Dreams |
   | File thiết kế gốc | **`.fig`** (Figma) | Figma, Penpot (nhập được phần lớn) |
   | Hoạt hoạ | **`.riv`** + file nguồn Rive, hoặc **Lottie `.json`** + file `.aep` | Rive, After Effects |
   | Raster | **PNG** nền trong, @1x/@2x/@3x | tất cả |
   | Bảng màu | **`.ase`** (Adobe Swatch Exchange) + bảng mã hex trong tài liệu | Illustrator, Photoshop, Figma, Affinity |

   **Không** bịa định dạng riêng, **không** nhét dữ liệu vào JSON tự chế mà chỉ
   script của dự án đọc được, **không** bắt ai cài công cụ lạ để xem được hình.

2. **Đặt tên lớp và nhóm theo quy ước, bằng tiếng Anh không dấu.** Hoạ sĩ mở
   file ra là hiểu ngay cấu trúc, không cần hỏi:

   ```
   nao/
     body
     folds
     face/ eye-left · eye-right · mouth
     limbs/ arm-left · arm-right · leg-left · leg-right
     slots/ slot-eyes · slot-ears · slot-head-top · slot-shoulder-right …
   props/
     glasses · headphones · pencil · scarf …
   ```

   Tên slot phải **giống hệt nhau giữa hai nhân vật** — xem luật ở mục 2.7.

3. **Bàn giao cả bản sửa được, không chỉ bản xuất.** Gửi SVG đã bẹt hết (flatten)
   là gửi một bức ảnh: hoạ sĩ không tách mảnh ra được. Giữ nguyên nhóm, nguyên
   lớp, **đường nét còn là stroke chứ chưa expand**, không mask thừa, không
   clip-path thừa.

4. **Ghi rõ thông số kỹ thuật** trong một file `README` nằm cùng thư mục bàn
   giao: không gian màu **sRGB**, mã màu hex, đơn vị và khung vẽ (artboard), độ
   dày nét gốc, cỡ nhỏ nhất cho phép, giấy phép sử dụng.

**Hiện vật cần có:** một thư mục bàn giao có cấu trúc cố định —

```
linh-vat/
  README.md              ← thông số, giấy phép, cách dùng
  bible/                 ← style guide, turnaround, do/don't (PDF)
  vector/                ← SVG + AI/PDF, còn nguyên lớp
  props/                 ← từng phụ kiện một file
  raster/                ← PNG @1x @2x @3x
  motion/                ← .riv / .json + file nguồn
  mau/                   ← .ase + bảng hex
```

---

## 3. Danh sách hiện vật, theo thứ tự phải làm

Không nhảy cóc: mỗi bước dựa vào bước trước.

| # | Hiện vật | Vì sao phải có nó trước |
|---|---|---|
| 1 | **Character bible** — style guide, turnaround, proportion chart, bảng màu, bảng do/don't | Là "đặc tả". Mọi thứ sau đều đối chiếu về đây. |
| 2 | **Vector master** — vẽ lại hai nhân vật thành vector, từ ảnh đã chốt | Ảnh raster không rig được, không tách mảnh được. **Bước này không có đường tắt.** |
| 3 | **Prop sheet** + đánh dấu điểm gắn | Phải có mảnh rời thì mới cắm vào slot được |
| 4 | **Component library** (Figma): variants + instance-swap + variables | Chỗ "đổi phụ kiện chéo" chạy được lần đầu |
| 5 | **Expression sheet / pose sheet / two-shot sheet** | Nội dung cho library ở bước 4 |
| 6 | **Rig** + action library + state machine | Mở cửa sang animation, truyện, video |
| 7 | **Export pipeline**: SVG, `.riv`/Lottie, PNG @2x/@3x | Mở cửa sang Android/iOS |
| 8 | **Design tokens** màu, dùng chung với `src/styles/index.css` | Nối thiết kế với code, đúng luật 1 của dự án |
| 9 | **Thư mục bàn giao** theo cấu trúc ở mục 2.9 | Để chuyển cho hoạ sĩ thật lúc nào cũng được |

## 4. Công cụ đề xuất

| Việc | Công cụ | Lý do |
|---|---|---|
| Vector master, component library | **Figma** | Có đủ component / variant / instance-swap / variable; phổ thông nhất trong giới; chia sẻ bằng link |
| Hoạt hoạ trong app | **Rive** | Xuất `.riv`, có state machine nhận input từ code, có runtime cho web, iOS, Android, React Native |
| Hoạt hoạ chỉ phát thẳng, không tương tác | **Lottie** (After Effects + Bodymovin) | Nhẹ hơn, nhưng không nhận input |
| Game-style rig nhiều skin | Spine | Mạnh nhất về slot / attachment / skin, nhưng trả phí và thừa với nhu cầu hiện tại |

Cả ba đều là công cụ phổ thông, hoạ sĩ nhận file về không phải học gì mới.
Giá và hạn mức thay đổi theo thời gian — **kiểm tra lại trước khi chốt**; tài
liệu này cố ý không ghi con số nào.

## 5. Chỗ ngành thiết kế **không** làm được như code

Nói rõ để không kỳ vọng sai:

1. **Không có compiler.** Không gì chặn một hoạ sĩ (hay một AI) vẽ lệch mẫu.
   Thứ thay thế là **cổng duyệt của con người** dựa trên bảng do/don't. Đây là
   khác biệt bản chất, không phải thiếu công cụ.
2. **Không có "giống hệt" nếu còn sinh ảnh.** Mỗi lần gọi AI là một lần rút
   thăm. Muốn giống hệt thì phải **ngừng sinh và bắt đầu lắp** — tức là phải có
   vector master.
3. **Ảnh raster hiện tại là ngõ cụt về mặt tái dùng.** Nó giữ nét gốc 100%,
   nhưng không tách mảnh, không gắn slot, không rig, không co giãn được. Nó
   đúng vai trò **ảnh tham chiếu chuẩn**, không đúng vai trò **tài nguyên sản
   xuất**.
4. **Reuse trong thiết kế là kỷ luật, không phải ràng buộc.** Figma không báo
   lỗi khi ai đó detach một instance rồi sửa tay. Code thì báo.

## 6. Câu chưa có đáp án

Theo luật của dự án: gặp những câu này thì hỏi, đừng suy đoán.

| Câu | Vì sao nó chặn đường |
|---|---|
| **Ai vẽ bản vector master?** Bạn, hoạ sĩ thuê, hay AI vector hoá rồi sửa tay | Quyết định toàn bộ thời gian và chất lượng của bước 2, mà bước 2 chặn mọi bước sau |
| Có cần góc nghiêng và góc sau không, hay chỉ chính diện | Quyết định quy mô turnaround. Chỉ app thì chính diện là đủ; truyện tranh thì không |
| Có làm video có thoại không | Quyết định có cần mouth chart hay không |
| Hoạt hoạ trong app là phát thẳng hay có tương tác | Quyết định chọn Lottie hay Rive |
| Ngân sách công cụ | Quyết định được dùng tính năng nào của Figma và Rive |
