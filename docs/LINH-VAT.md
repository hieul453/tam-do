# Linh vật Não và Tim — hợp đồng phong cách

> **Dùng khi nào:** mỗi lần nhờ AI sinh ảnh linh vật, bất kể AI nào.
>
> **Ba bước:**
>
> 1. Đính kèm `docs/linh-vat/anh-goc.webp` — **bắt buộc, không có ngoại lệ**.
>    Nếu đã có ảnh mới được duyệt trong `docs/linh-vat/da-duyet/`, đính kèm
>    thêm cái gần nhất.
> 2. Chép nguyên văn **Khối A** bên dưới.
> 3. Điền **Khối B** theo nhu cầu lúc đó, dán kèm **Prompt âm**.
>
> Chép xong thì kiểm bằng mục 7 trước khi dùng. Ảnh đạt thì bỏ vào
> `da-duyet/`, nó thành tham chiếu cho lần sau.

---

## 1. Khối A — chép nguyên văn, không diễn đạt lại

Viết bằng tiếng Anh vì phần lớn mô hình sinh ảnh bám tiếng Anh chắc hơn. Đừng
dịch sang tiếng Việt khi gửi cho AI sinh ảnh.

```
STYLE CONTRACT — follow exactly. Do not paraphrase, do not reinterpret.
The attached reference image is the single source of truth. Match it.

CHARACTERS
- BRAIN: a lavender-purple brain. Rounded lumpy cloud silhouette with a few
  simple curved fold lines inside. Wears large round black-rimmed glasses.
- HEART: a coral-red heart. Classic two-lobe shape with a pointed bottom.
  Wears mint-green over-ear headphones with a band over the top.
Both are full-body characters: the head IS the body. No neck, no torso.

LINE
One single constant stroke weight everywhere, including limbs. Near-black ink.
Closed contours. No tapering, no variable weight, no coloured outlines, no
visible sketch or pencil lines.

COLOUR
Absolutely flat fill. No gradient, no shading, no ambient occlusion, no
highlight, no texture, no grain, no paper fibre.
brain #9097DE · heart #D46B76 · mint #9BE5C5 · ink #0B0B12 ·
eye white #FCFCFC · paper #F5F4E9 · shadow #E0D8C8. Colour space sRGB.

FACE
Large vertical-oval white eyes with solid black pupils and NO catch light and
NO highlight dot. Small simple mouth. Eyebrows only when the expression needs
them, and then they are two short strokes. No blush, no freckles, no nose.
CRITICAL: the face is the SAME ABSOLUTE SIZE on both characters. Eyes and eye
spacing do NOT scale with the body. The heart is smaller than the brain, but
its face is not.

LIMBS
Rubber-hose: thin black strokes, no joints, no muscle, same stroke weight as
the body outline. Hands are three short strokes. Each foot is one short
horizontal stroke. Limbs attach straight to the body with no shoulder or hip
shape drawn.

GROUND
Plain cream background, nothing else in the scene. The only shadow is a single
flat hard-edged ellipse under the feet. No shadow cast onto the body.

NEVER DRAW
gradient · soft shadow · blur · 3D · bevel · texture · grain · blush cheeks ·
eye catch light · coloured outline · variable line weight · painterly brush ·
realistic anatomy · jointed fingers · knuckles · neck · separate torso ·
detailed teeth · tongue detail · text · watermark · signature · frame ·
border · multiple panels
```

## 2. Khối B — điền theo nhu cầu lúc đó

```
THIS REQUEST
Characters:        [BRAIN | HEART | both]
Expression:        [
Pose or action:    [
Accessories:       [
Interaction:       [only if both characters]
Comic effects:     [optional
Framing:           full body, front view, centred, plain cream background
Output:            one single image, square, no text
```

Từ vựng dùng sẵn — bám vào đây, đừng nghĩ thêm thứ lệch phong cách:

| Ô | Chọn trong số này |
|---|---|
| **Expression** | neutral · happy · thinking · surprised · sad · winking · tired · proud · confused · embarrassed |
| **Pose** | standing · waving · jumping · running · sitting · hand on chin thinking · arms open · pointing · lying down · reading |
| **Interaction** | standing side by side · high five · hugging · one comforting the other · arguing face to face · walking together · one pulling the other forward |
| **Comic effects** | sweat drop · speed lines · exclamation marks · floating hearts · lightbulb above head · question mark · spiral eyes |

## 3. Prompt âm

Dán vào ô negative prompt nếu công cụ có. Nếu không có ô riêng thì Khối A đã
có mục `NEVER DRAW` làm việc đó rồi.

```
gradient, shading, soft shadow, blur, 3D, bevel, texture, grain, noise,
blush cheeks, eye highlight, catch light, coloured outline, variable line
weight, painterly brush, watercolour, realistic anatomy, jointed fingers,
knuckles, neck, separate torso, detailed teeth, extra limbs, extra characters,
text, letters, watermark, signature, border, frame, collage, multiple panels
```

## 4. Ví dụ đã điền sẵn

**Một nhân vật, dùng trong app:**

```
THIS REQUEST
Characters:        BRAIN
Expression:        thinking
Pose or action:    hand on chin thinking
Accessories:       round glasses, pencil behind the ear
Comic effects:     question mark above the head
Framing:           full body, front view, centred, plain cream background
Output:            one single image, square, no text
```

**Hai nhân vật tương tác:**

```
THIS REQUEST
Characters:        both
Expression:        BRAIN sad, HEART gentle and warm
Pose or action:    BRAIN slumped, HEART reaching out
Accessories:       BRAIN round glasses, HEART mint headphones
Interaction:       one comforting the other
Comic effects:     one sweat drop near the brain
Framing:           full body, front view, both on the same ground line
Output:            one single image, wide, no text
```

**Khung truyện tranh:**

```
THIS REQUEST
Characters:        both
Expression:        BRAIN annoyed, HEART excited
Pose or action:    BRAIN arms crossed, HEART jumping
Interaction:       arguing face to face
Comic effects:     speed lines behind the heart
Framing:           full body, side-on two-shot, plain cream background
Output:            one single image, 4:3, no text, no speech bubble
```

## 5. Số đo — để kiểm, không phải để đoán

Lấy bằng cách dựng biểu đồ tần suất màu và quét từng hàng từng cột pixel trên
chính `anh-goc.webp`. **Không ước lượng bằng mắt.**

### Màu

| Vai trò | Mã | Sai số cho phép |
|---|---|---|
| Thân Não | `#9097DE` | ±3 mỗi kênh |
| Thân Tim | `#D46B76` | ±3 |
| Xanh bạc hà | `#9BE5C5` | ±3 |
| Nét viền | `#0B0B12` | ±8 |
| Lòng trắng mắt | `#FCFCFC` | ±4 |
| Nền giấy | `#F5F4E9` | ±4 |
| Bóng đổ | `#E0D8C8` | ±4 |
| Vàng bóng đèn | `#FCF494` | ±6 |
| Xanh giọt mồ hôi | `#BCD8E4` | ±6 |

### Tỉ lệ

Đơn vị: **chiều rộng thân Não = 100**.

| Phép đo | Giá trị |
|---|---|
| Thân Não | rộng 100, cao 75 |
| Thân Tim | rộng 72, cao 73 |
| Lòng trắng mắt | rộng 16, cao 19 |
| Khoảng cách hai tâm mắt | 32 |
| Tròng kính | đường kính 29, tâm trùng tâm mắt, hai tròng gần chạm nhau |
| Chụp tai nghe | rộng 12, nằm sát ngay ngoài đường viền thân |
| Tâm mắt của Não | 50% chiều cao thân, tính từ đỉnh |
| Tâm mắt của Tim | 42% chiều cao thân |
| Miệng của Tim | 79% chiều cao thân |
| Miệng của Não | ngay dưới mép dưới tròng kính |

> Mắt và khoảng cách hai mắt của Não và Tim **bằng nhau tính theo pixel tuyệt
> đối**, dù hai thân khác hẳn kích thước. Hoạ sĩ vẽ một khuôn mặt rồi đặt lên
> hai thân. Đây là lý do hai nhân vật trông cùng một nhà. Mất điều này là mất
> nhận diện, kể cả khi màu và nét vẫn đúng.

**Chưa đo được, đừng điền bừa:** chiều dài tay chân, vị trí khớp vai và khớp
hông, tỉ lệ con ngươi so với lòng trắng. Cần tới thì đo lại từ ảnh gốc.

## 6. Luật phụ kiện

Phụ kiện phải nói đúng bản chất nhân vật, không thêm chỉ vì dễ thương.

| | Là dụng cụ của… | Dùng được |
|---|---|---|
| **Não** | lý trí, đo đạc, ghi chép | kính tròn, bút chì, kính lúp, sổ tay, thước, đồng hồ bấm giờ |
| **Tim** | cảm xúc, chăm sóc, kết nối | tai nghe, khăn quàng, băng dán, ly ấm, trái tim nhỏ, chăn |

Đổi chéo được, và **đổi chéo là có nghĩa**: Não đội tai nghe là lý trí đang
chịu nghe cảm xúc; Tim đeo kính là cảm xúc đang cố lý trí. Dùng đúng lúc thì
đắt, dùng vặt thì nhạt.

## 7. Nghiệm thu — đo, không chấm bằng mắt

Mỗi ảnh nhận về phải qua đủ bảy mục. Trượt mục nào thì sinh lại, đừng sửa tay.

1. **Nét** — lấy mẫu năm điểm trên đường viền: cùng một độ dày, màu trong
   khoảng `#0B0B12` ±8 mỗi kênh.
2. **Màu bệt** — trong vùng thân, ≥ 90% pixel nằm trong ±6 mỗi kênh so với mã
   đã cho. Thấy nhiều hơn một dải màu là có gradient, trượt.
3. **Mắt** — rộng lòng trắng ÷ rộng thân Não = 0.16 ± 0.02.
4. **Khoảng cách mắt** — ÷ rộng thân Não = 0.32 ± 0.03.
5. **Tỉ lệ hai nhân vật** — rộng Tim ÷ rộng Não = 0.72 ± 0.04.
6. **Tay chân** — nét đơn, không viền trong viền, không khớp, không ngón có đốt.
7. **Danh sách cấm** — không má hồng, không chấm sáng mắt, không bóng mềm,
   không chữ, không watermark, không khung.

Mục 3, 4, 5 đo nhanh bằng bất cứ công cụ nào đọc được toạ độ pixel. Mục 1 và 2
cần lấy mẫu màu — công cụ chọn màu của trình duyệt hay của Figma đều làm được.

## 8. Mẹo giữ đồng nhất giữa các lần sinh

Xếp theo mức hiệu quả, cao xuống thấp:

1. **Luôn đính kèm ảnh.** Chữ không ép được hình. Đây là thứ duy nhất thật sự
   kéo kết quả về đúng mẫu. Prompt chỉ là phần bổ sung.
2. **Nuôi bộ ảnh đã duyệt.** Mỗi ảnh đạt nghiệm thu thì bỏ vào
   `docs/linh-vat/da-duyet/`, đặt tên theo mẫu
   `nao-nghi-2026-11-25.png`. Lần sau đính kèm cả ảnh gốc lẫn ảnh gần nhất —
   bộ tham chiếu càng dày thì càng ít trôi.
3. **Dùng tính năng tham chiếu của công cụ** nếu có: *character reference*,
   *style reference*, hoặc chế độ sửa ảnh có sẵn. Mạnh hơn nhiều so với chỉ
   đính kèm ảnh trong khung chat.
4. **Mỗi lần một nhân vật, một góc nhìn.** Cảnh hai nhân vật trôi nhiều hơn
   hẳn. Cần cảnh đôi thì sinh riêng từng con rồi ghép, nếu ghép được.
5. **Ghi lại seed** nếu công cụ cho. Seed của một bản đạt là tài sản.
6. **Sinh lại, đừng bảo nó sửa.** Trừ khi công cụ có inpaint đàng hoàng, bảo
   sửa thường làm lệch thêm chỗ khác.
7. **Nền trơn, không bối cảnh.** Thêm bối cảnh là thêm một biến trôi.

## 9. Quyết định đang theo, và cái giá của nó

**25/11/2026 — chọn hướng ảnh raster.** Cần gì thì sinh lúc đó, không dựng
vector master, không dựng rig, không dựng thư viện thành phần.

Được: giữ nguyên nét gốc, bắt đầu ngay, không phải thuê hoạ sĩ, không phải học
công cụ mới.

Mất, nói thẳng để sau không ngạc nhiên:

- **Không có bảo đảm giống hệt.** Mỗi lần sinh là một lần rút thăm. Tài liệu
  này kéo xác suất lên cao và cho bạn thước để loại bản trượt — nó không ép
  được mô hình.
- **Không đổi phụ kiện bằng tham số.** Muốn Não đội tai nghe thì phải sinh lại
  cả ảnh, không phải tráo một mảnh.
- **Không tái dùng động tác.** Mỗi tư thế mới là một lần sinh mới, kể cả khi
  cùng một động tác cho nhân vật kia.
- **Không co giãn.** PNG phóng to là vỡ. Cỡ nào cần thì phải sinh ở cỡ đó, và
  ảnh gốc hiện tại chỉ 1024×1024 cho cả 14 tư thế, nên mỗi nhân vật chỉ khoảng
  210 pixel — đủ cho web, **không đủ cho in hay video**.
- **Không có hoạt hoạ thật.** Muốn animation thì tới lúc đó vẫn phải quay lại
  bước vector, hoặc chấp nhận hoạt hoạ kiểu lật hình.

Lúc nào thấy ba điều này bắt đầu cắn — sinh lại quá nhiều lần cho cùng một
thứ, cần in hoặc dựng video, hoặc cần animation thật — thì đó là tín hiệu nên
quay lại dựng vector master. Lịch sử git còn giữ bản phân tích hướng thiết kế
đã bỏ: `git log --oneline` rồi xem commit `dc9c43b` trở về trước.

## 10. Thư mục

```
docs/linh-vat/
  anh-goc.webp     ← bản chốt, đính kèm mỗi lần, không sửa
  da-duyet/        ← ảnh đã qua mục 7, đặt tên <nhan-vat>-<trang-thai>-<ngay>.png
```
