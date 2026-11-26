# Linh vật Não và Tim — hợp đồng phong cách

> **Mỗi lần nhờ AI sinh ảnh:** đính kèm đúng ảnh tham chiếu cần dùng (xem bảng
> ngay dưới), chép khối prompt, điền dòng `REQUEST` cuối cùng.
>
> Ảnh đính kèm là thứ giữ phong cách, không phải chữ. Thiếu ảnh thì prompt này chỉ còn một nửa tác dụng.

> **Tình trạng hôm nay (26/11/2026):** ba ảnh tham chiếu bên dưới **chưa được
> sinh**. Thứ đang có là `anh-goc.webp` — một tờ gộp bảy cặp ở 1024×1024, nên
> mỗi nhân vật chỉ còn khoảng 186px: quá nhỏ để đọc chất nét, mà chất nét lại là
> yêu cầu khó nhất của cả bộ. Nó cũng có chữ trong ảnh, trái luật số 4.
>
> Dùng tạm được, nhưng **bảng tỉ lệ bên dưới mới là chuẩn**, không phải ảnh cũ.
> Sinh ba ảnh mới theo đúng đặc tả rồi mới bỏ `anh-goc.webp` đi.
>
> Ba yêu cầu để sinh chúng đã viết sẵn, chép thẳng được: mục
> [Ba yêu cầu để sinh ba ảnh tham chiếu](#ba-yêu-cầu-để-sinh-ba-ảnh-tham-chiếu).
> Ảnh nhận về thì soi bằng [`to-mau-ty-le.svg`](to-mau-ty-le.svg) — tờ mẫu tỉ lệ
> cho người duyệt, **không phải ảnh để đính kèm**.

## Ba ảnh tham chiếu

Máy sinh ảnh không dựng lại nhân vật từ chỗ hiểu nó — nó **khớp mẫu**, và nó
khớp cả thứ mình không định đưa: **bố cục**. Đưa một tờ nhiều hình xếp lưới thì
nó học luôn "ảnh này gồm nhiều hình nhỏ rải rác". Vì vậy mỗi ảnh làm đúng một
việc, và **một lượt đính kèm tối đa hai ảnh**.

| Ảnh | Đính kèm khi | Vì sao tồn tại |
|---|---|---|
| `tham-chieu-doi.png` | mặc định, mọi yêu cầu có cả hai nhân vật | Thứ khó giữ nhất không nằm ở từng con mà ở **quan hệ giữa hai con**: thân Tim nhỏ hơn nhưng mặt bằng nhau, cùng độ dày nét, cùng một đường chân. Tách ra hai ảnh là mất đúng cái đó |
| `tham-chieu-nao.png` | yêu cầu chỉ có Não | |
| `tham-chieu-tim.png` | yêu cầu chỉ có Tim | |

**Không làm tờ turnaround.** Gộp chính diện, nghiêng, sau vào một ảnh thì khả
năng cao nhận về… một tờ turnaround. Góc nghiêng và góc sau chỉ cần khi làm
truyện, và khi đó làm **mỗi góc một ảnh riêng**.

**Không làm dải biểu cảm cho máy.** Một dải mặt xếp hàng là một cái lưới, và máy
sẽ chép cái lưới. Biểu cảm mô tả bằng chữ trong `REQUEST`; phong cách để ảnh giữ.

### Đặc tả ba ảnh đó

| | |
|---|---|
| Kích thước | **2048×2048**, tối thiểu 1536 |
| Định dạng | **PNG, hoặc WebP không mất dữ liệu** |
| Nhân vật cao | khoảng **70% chiều cao khung** |
| Lề trống | **ít nhất 8% mỗi phía**, nhân vật không chạm mép khung |
| Nền | kem `#F5F4E9`, phẳng, **không tách nền** |
| Bóng | giữ ellipse `#E0D8C8` dưới chân — nó dạy máy luật "chân chạm đất" |
| Trong khung | không còn gì nữa: không chữ, không khung viền, không lấp lánh, không đạo cụ |
| Tư thế | **diễn nhẹ**: dồn trọng tâm một chân, một tay làm cử chỉ nhỏ |

Ba chỗ đáng giải thích thêm:

- **Vì sao không nén mất dữ liệu.** Với tranh nét màu bệt, nén mất dữ liệu sinh
  nhiễu đúng ngay ở rìa nét — tức là phá hỏng chính thứ mình đang muốn máy học.
  Mà tranh màu bệt ít màu thì PNG nén rất gọn, nên gần như không tốn thêm.
- **Vì sao giữ nền kem thay vì nền trắng.** Nền trong một ảnh tham chiếu không
  trung tính — nó đổi thứ máy sinh ra. Màu bệt trên nền kem đọc dịu hơn hẳn trên
  nền trắng; đổi sang trắng thì máy tự bù bằng cách đẩy màu tươi và tương phản
  gắt hơn, và cả bảng màu trôi đi. Thêm nữa, bóng `#E0D8C8` chỉ tồn tại được vì
  có nền kem; đặt nó lên nền trắng là thành vệt bẩn.
- **Vì sao tư thế phải diễn nhẹ, không đứng nghiêm.** Prompt cấm "tư thế đứng đơ
  không diễn gì". Ảnh tham chiếu mà đứng đơ thì ảnh và chữ mâu thuẫn. Nhưng tư
  thế quá đặc trưng thì máy chép luôn tư thế. Diễn nhẹ là chỗ cân bằng.

## Bảng tỉ lệ

Đây là **đặc tả mà ảnh tham chiếu phải đạt**, không phải số đo của ảnh cũ. Làm
theo thứ tự này: chốt bảng → sinh ảnh theo bảng → ảnh đó thành chuẩn.

Mọi số tính theo đơn vị **chiều cao thân Não = 10**, nên không phụ thuộc kích
thước file.

| | Não | Tim |
|---|---|---|
| Thân — cao | **10** | **8.8** |
| Thân — rộng | 11.5 | 9.6 |
| Mắt — đường kính | **2.6** | **2.6** |
| Mắt — tâm cách tâm | **4.2** | **4.2** |
| Mắt — tâm cao bao nhiêu, tính từ đáy thân | 58% | 58% |
| Con ngươi — đường kính | 1.3 | 1.3 |
| Nét viền — dày | **0.45** | **0.45** |
| Tay — dài | 5.5 | 5.5 |
| Chân — dài | 3.8 | 3.8 |
| Điểm gắn tay, tính từ đáy thân | 55% | 55% |
| Bóng — rộng | 11 | 9.5 |

Những ô **in đậm** là những ô không được trôi. Đặc biệt: **thân Tim bằng 88% thân
Não, nhưng mắt bằng 100%.** Đó chính là con số làm cho luật "hai nhân vật cùng cỡ
mặt" kiểm được bằng thước thay vì bằng cảm giác.

### Kính và tai nghe

| | |
|---|---|
| Tròng kính — đường kính | **3.6** (rộng hơn mắt 2.6 một khoảng rõ rệt) |
| Gọng kính — dày | **0.45** — bằng đúng nét thân, **không dày hơn** |
| Cầu nối hai tròng — dày | 0.45 |
| Chụp tai — đường kính | 2.8 |
| Vòng cung tai nghe — dày | 0.5 |

Lý do hai con số đầu quan trọng: ở bản cũ, gọng kính dày hơn nét thân và tròng
kính gần bằng mắt, nên **hai vòng đen chồng lên nhau thành một mảng** — ở cỡ nhỏ
Não mất mặt. Tròng rộng hơn mắt thì có khoảng trắng thở giữa con ngươi và gọng.

**Dưới 32px:** kính rụng xuống còn một nét ngang, tai nghe bỏ hẳn — giống cách
logo bỏ linh vật ở cỡ favicon. Dưới 20px thì chỉ còn khối thân.

## Prompt có hai chế độ

Cùng một khối prompt, khác nhau đúng ở đoạn cuối.

**Chế độ khám phá** — giữ nguyên khối `GIVE ME 3–5 VERSIONS`. Dùng khi cần ý
tưởng: chưa biết muốn tư thế nào, muốn xem máy nghĩ ra gì.

**Chế độ sản xuất** — **xoá hẳn khối `GIVE ME 3–5 VERSIONS`**, thay bằng
`GIVE ME ONE IMAGE.` Dùng khi đã biết chính xác cần gì: ảnh tham chiếu, ảnh cho
một màn cụ thể, một khung truyện. Xin năm phương án cho một thứ đã biết rõ chỉ
làm loãng, và mỗi phương án lại lệch chuẩn một kiểu.

**Ba ảnh tham chiếu phải sinh ở chế độ sản xuất.**

## Prompt — chép nguyên văn

```
The attached image is the style reference. Match its art style, line, colour
and proportions. Where the image and this text disagree about how something
LOOKS, the image wins. The NEVER list at the end always wins and is never
overridden by anything you see in the image.

TWO CHARACTERS, from a Vietnamese psychology-learning app:
- BRAIN — lavender purple, round black-rimmed glasses. Reason, logic, the one
  who overthinks.
- HEART — coral red, mint-green headphones. Emotion, impulse, warmth.

HOW THE BODY IS BUILT — settle this before drawing anything else:
Each character is ONE shape plus four lines. The brain shape is the entire
body. The heart shape is the entire body. Two thin black lines leave the
sides as arms, two leave the bottom as legs, each ending in a small stroke
for hand and foot. That is the complete anatomy. These are not people and not
people in costume: nothing sits on top of a body, and there are no shoulders,
no chest, no waist, no hips, no neck.

PROPORTIONS — measure these, do not eyeball them. Taking the brain's body
height as 10 units: the heart's body is 8.8 tall, but BOTH characters have the
same eyes — 2.6 across, centres 4.2 apart. The outline is 0.45 thick on both.
A heart with smaller eyes than the brain is a failed drawing.

THE GLASSES AND THE HEADPHONES are built, not stuck on. The glasses' rims are
exactly as thick as the body outline, never thicker. Each lens is 3.6 across —
clearly wider than the 2.6 eye inside it — so a ring of white shows between
pupil and rim. If rim and pupil merge into one black mass, the lens is too
small; enlarge it.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight black ink outline drawn with a confident hand
rather than a mechanically perfect vector path, no gradient and no shading,
minimal detail. And genuinely funny — minimalism in the drawing,
personality in the acting. Cute alone is not the target; the joke is.

IT MUST NOT LOOK MACHINE-MADE — treat this as the hardest requirement.
Every stroke is one confident closed line, with clean joins where the limbs
meet the body and no mush at the hands and feet. Nothing is ALMOST
symmetrical: either commit to symmetry or break it clearly. Edges stay crisp
— no glow, no halo, no stray third colour bleeding along the outline. Add
nothing that was not asked for: no sparkles, no vignette, no texture overlay,
no extra highlight, no decorative squiggles. Push the acting: the pose must
read as a silhouette and must be clearly performed, never a stiff neutral
stock pose, and the feet must sit on the ground instead of floating.

TELL IT THROUGH ACTION. The pose, the face and the body language carry the
whole meaning. No speech bubbles, no captions, no written words anywhere in
the image. If the viewer has to read something to get it, the pose is wrong —
redraw the pose.

You may borrow gags, poses and visual clichés from pop culture, Vietnamese or
international, whenever they land better than a literal illustration.

KEEP: brain #9097DE · heart #D46B76 · mint #9BE5C5 · ink #0B0B12 ·
paper #F5F4E9 · flat ellipse shadow #E0D8C8. Both characters share the SAME
face size — the heart's body is smaller, its eyes are not.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, 3D,
texture, blush cheeks, coloured outline, variable line
weight, sparkles, glow, halo, vignette, texture overlay, stiff symmetrical
stock pose, subject floating with no ground contact, text, watermark, frame.

GIVE ME 3–5 VERSIONS of this request, as separate images — not one sheet,
not one image split into panels. Identical characters, identical style and
colours across all of them. What differs is the IDEA: another gag, another
pose, another piece of staging. Five jitters of the same drawing is a failed
answer. Number them in your reply, never inside the image.

REQUEST:
```

## Ba yêu cầu để sinh ba ảnh tham chiếu

Chép khối prompt ở trên, **xoá khối `GIVE ME 3–5 VERSIONS`**, thay bằng
`GIVE ME ONE IMAGE.`, rồi dán một trong ba đoạn dưới vào sau `REQUEST:`.

Đính kèm `anh-goc.webp` làm ảnh phong cách cho cả ba lần — nó là thứ duy nhất
đang có. Nhưng **bảng tỉ lệ mới là chuẩn**, nên trong cả ba yêu cầu đều có câu
bắt đo lại, và người duyệt phải soi bằng tờ mẫu tỉ lệ chứ không bằng ảnh cũ.

### 1 · `tham-chieu-doi.png`

```
This image becomes the canonical style reference for every future request, so
it must show line quality and the size relationship between the two clearly.
Give them the whole frame.

Both characters standing on one shared ground line, facing the viewer, LIGHTLY
performed: weight on one leg, one small hand gesture each, mouths in an easy
closed smile. Brain on the left with its glasses, heart on the right with its
headphones. No gag, no props, no scene, no interaction between them — this is a
portrait of the pair, not a joke.

Fill the frame: the pair should be about 70% of the image height, with empty
cream on all four sides and neither character touching any edge.
Flat cream background. Each character has its flat ellipse shadow on the
ground. Nothing else exists in this image.

Square image, as large as you can produce.

Re-measure before you finish: the heart's body is 8.8 tall where the brain's is
10, but their eyes are the same size. Each glasses lens is clearly wider than
the eye inside it.
```

### 2 · `tham-chieu-nao.png`

```
The BRAIN alone, nothing else in the frame.

Facing the viewer, lightly performed: weight on one leg, one hand making a
small gesture, easy closed smile, glasses on. No props, no gag, no scene.

Fill the frame: about 70% of the image height, empty cream on all four sides,
not touching any edge. Flat cream background, its flat ellipse shadow on the
ground, nothing else.

Square image, as large as you can produce.

The glasses are the thing to get right here: rims exactly as thick as the body
outline, each lens clearly wider than the eye inside it, a visible ring of
white between pupil and rim.
```

### 3 · `tham-chieu-tim.png`

```
The HEART alone, nothing else in the frame.

Facing the viewer, lightly performed: weight on one leg, one hand making a
small gesture, easy closed smile, headphones on. No props, no gag, no scene.

Fill the frame: about 70% of the image height, empty cream on all four sides,
not touching any edge. Flat cream background, its flat ellipse shadow on the
ground, nothing else.

Square image, as large as you can produce.

The eyes are the thing to get right here. This character's body is smaller than
the brain's, and the eyes must NOT shrink with it: same diameter, same spacing,
same size as the brain's eyes. If the face looks smaller than the brain's face,
redraw it.
```

## Luật phụ kiện

Phụ kiện phải nói đúng bản chất nhân vật, không thêm chỉ vì dễ thương.

| | Dụng cụ của… | Ví dụ |
|---|---|---|
| **Não** | lý trí, đo đạc, ghi chép | kính tròn, bút chì, kính lúp, sổ tay, thước |
| **Tim** | cảm xúc, chăm sóc, kết nối | tai nghe, khăn quàng, băng dán, ly ấm, chăn |

Đổi chéo được, và đổi chéo là **có nghĩa**: Não đội tai nghe là lý trí đang
chịu nghe cảm xúc; Tim đeo kính là cảm xúc đang cố lý trí.

Kính của Não thì **giữ nguyên kiểu** — tròn, gọng đen. Chỉ sửa dựng hình, xem
bảng tỉ lệ ở trên.

## Tài sản giao cho app

Ảnh tham chiếu **không tách nền**. Tài sản giao cho app thì **phải tách**.

Hai thứ khác nhau vì phục vụ hai việc: ảnh tham chiếu dạy máy phong cách, nên
cần cả nền kem lẫn bóng. Còn trong app, linh vật sẽ phải đứng trên thẻ màu
lavender, trên nền tối, trong khung truyện có bối cảnh riêng, và làm icon.

May là luật **"mỗi nét là một đường khép kín"** đã có sẵn chính là thứ làm việc
tách nền chạy được bằng máy: nhân vật được bao trọn bởi nét mực, nên tô loang từ
ngoài vào không ăn mất tròng mắt trắng. Một luật viết cho thẩm mỹ lại cứu phần
kỹ thuật.

Hai điều kiện để tách được bằng máy thay vì ngồi cắt tay:

- **Nhân vật không chạm mép khung** — lề trống ít nhất 8% mỗi phía.
- **Bóng là lớp rời.** Giao kèm hai bản: một bản có bóng, một bản không. Nếu chỉ
  có bản dính bóng thì mọi lần đặt lên nền khác đều phải xoá bóng bằng tay.

## Tờ mẫu nội bộ ≠ ảnh tham chiếu

Hai tài liệu, hai việc. Trộn chúng lại chính là lý do dòng chữ
"Inquisitive & Thinking" lọt vào ảnh gốc, trong khi luật số 4 cấm chữ trong ảnh —
và vì quy tắc ưu tiên ghi rằng ảnh thắng chữ, ảnh đó đang **dạy máy rằng được
phép viết chữ vào hình**.

| | Dùng để | Có chữ không |
|---|---|---|
| **Tờ mẫu nội bộ** | người duyệt đối chiếu: tỉ lệ, điểm gắn tay chân, cỡ mắt, bảng màu có mã | **Có** — nó là tài liệu sản xuất, không phải tài sản của app |
| **Ảnh tham chiếu** | đính kèm cho máy bắt chước | **Không một chữ nào** |

Tờ mẫu nội bộ của bộ này là [`to-mau-ty-le.svg`](to-mau-ty-le.svg). Mở nó cạnh
ảnh nhận về để soi. Nó cố tình **không vẽ lại nhân vật**: chỉ có hộp bao, vòng
mắt, vòng tròng kính, trục tay chân và số đo. Khung chữ nhật đứt nét là hộp bao,
không phải hình thân.

Lý do không vẽ nhân vật ra cho đẹp: tờ này là vector sạch tuyệt đối, đúng thứ
`NEVER` cấm máy bắt chước. Vẽ càng giống thì càng có ngày ai đó đính nó vào
prompt, và khi đó nó dạy máy đúng cái sai. Để nó trông như bản vẽ kỹ thuật là
một cách phòng thân — nhìn vào là biết không phải ảnh mẫu.

**Không bao giờ đính `to-mau-ty-le.svg` vào prompt sinh ảnh.** Nó có chữ, và
theo quy tắc ưu tiên thì ảnh thắng chữ.

## Nhận ảnh về thì soi bảy thứ

1. **Không có hình người** — chỉ một khối thân cộng bốn nét tay chân. Thấy vai, ngực, eo, hay một cái đầu đặt trên một thân người là trượt.
2. **Màu bệt và nét đều** — thấy chuyển sắc, bóng mềm hay nét lúc dày lúc mỏng là trượt.
3. **Mặt hai nhân vật cùng cỡ** — AI rất hay co mặt Tim theo thân nhỏ hơn. Mất cái này là hai nhân vật trông như hai nhà khác nhau. Giờ kiểm được bằng thước: thân Tim bằng 88% thân Não, mắt bằng 100%.
4. **Không có chữ trong ảnh** — kể cả chữ nhỏ trong bong bóng thoại.
5. **Không có mùi AI** — nét run hoặc hở ở chỗ tay chân nối vào thân, bàn tay bàn chân nhoè, hai bên gần đối xứng mà lệch nhẹ, hào quang mờ quanh viền, lấp lánh hay vân nền không ai yêu cầu, và tư thế đứng đơ không diễn gì.
6. **Kính không bít mắt** — phải thấy rõ khoảng trắng giữa con ngươi và gọng. Gọng dày bằng nét thân, không dày hơn.
7. **Thu nhỏ còn 32px vẫn đọc được** — cách kiểm rẻ nhất cho mọi lỗi ở trên. Chi tiết thừa ở cỡ lớn trông vô hại, ở cỡ nhỏ thành vệt bẩn.
