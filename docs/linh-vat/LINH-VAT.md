# Linh vật Não và Tim — hợp đồng phong cách

> **Mỗi lần nhờ AI sinh ảnh:** đính kèm đúng ảnh tham chiếu cần dùng (xem bảng
> ngay dưới), chép khối prompt, điền dòng `REQUEST` cuối cùng.
>
> Ảnh đính kèm là thứ giữ phong cách, không phải chữ. Thiếu ảnh thì prompt này chỉ còn một nửa tác dụng.

> **Tình trạng (26/11/2026): ba ảnh tham chiếu đã có.**
> `tham-chieu-doi.png` · `tham-chieu-nao.png` · `tham-chieu-tim.png`.
>
> Chúng do Gemini sinh qua bốn vòng, rồi chạy `scripts/don-anh-linh-vat.mjs`
> để ép về đúng chín màu chuẩn — bước đó giết lớp nhiễu mảnh máy phủ lên ảnh,
> làm bóng thành ellipse mép cứng, và kéo nền về đúng `#F5F4E9`.
>
> **Hai chỗ chưa đạt, ghi ra để đừng quên:**
> - **Không có bàn chân.** Chân kết thúc bằng nét trơn. Bốn vòng prompt không
>   ép được. Muốn đúng thì sửa tay.
> - **Viền thân Tim còn lẫn mực** — đo được 70–79% ám màu, phần còn lại là mực
>   đen. Viền Não thì đạt, 93–94%. Chữa bằng máy đã thử và bỏ: chỗ mực trên
>   mép thân nằm sát viền chụp tai, không tách được bằng hình học.
>
> `anh-goc.webp` giữ lại làm tư liệu — bảng màu và bảng tỉ lệ trong file này
> đều đo ra từ nó. Đừng đính nó vào prompt nữa.
>
> Cách sinh ra chúng — bốn vòng prompt và chỗ vấp của từng vòng — nằm trong
> lịch sử git:
> `git show 5022bd9:docs/linh-vat/sinh-anh-lan-dau.md`

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
| Kích thước | càng lớn càng tốt. Ba ảnh hiện có: đôi 2528×1559, Não 940×940, Tim 1004×1004. Hai ảnh đơn dưới mức mong muốn — mỗi nhân vật vẫn cao ~700px, gấp gần bốn lần ảnh gốc, nên dùng được |
| Định dạng | **PNG, hoặc WebP không mất dữ liệu** |
| Nhân vật cao | khoảng **70% chiều cao khung** — ảnh đơn thì vuông, ảnh đôi thì **ngang 3:2**, vì cặp dàn ngang không bao giờ cao 70% được trong khung vuông |
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

Bảng này **mô tả ba ảnh chuẩn**, không phải một mục tiêu mà chúng phải đạt. Thứ
tự đã đi qua rồi: đặc tả → sinh ảnh → đo ảnh → bảng chép lại số đo. Làm ngược
lại thì chữ và ảnh đá nhau, mà quy tắc ưu tiên nói ảnh thắng, nên chữ chỉ còn
gây nhiễu.

Mọi số tính theo đơn vị **chiều cao thân Não = 10**, nên không phụ thuộc kích
thước file. Cột cuối nói số đó đã đo hay mới chỉ ước.

| | Não | Tim | Nguồn |
|---|---|---|---|
| Thân — cao | **10** | **8.85** | đo cả ba ảnh |
| Thân — rộng | **13.1** | **9.1** | đo cả ba ảnh |
| Mắt — đường kính | **2.55** | **2.4** | đo cả ba ảnh |
| Mắt — tâm cách tâm | 4.6 | 4.2 | đo cả ba ảnh |
| Mắt — tâm cao, tính từ đáy thân | **51%** | **57%** | đo cả ba ảnh |
| Nét viền thân — dày | 0.19 | 0.26 | đo `anh-goc.webp` |
| Con ngươi — đường kính | 1.3 | 1.3 | **chưa đo** |
| Tay — dài · Chân — dài | 5.5 · 3.8 | 5.5 · 3.8 | **chưa đo** |
| Điểm gắn tay, tính từ đáy thân | 55% | 55% | **chưa đo** |
| Bóng — rộng | — | — | **chưa đo**, cứ theo ảnh chuẩn |

Hai con số quan trọng nhất, và **chỉ hai con số này thôi**:

- **Mắt hai nhân vật gần bằng nhau**: 2.55 và 2.4 đơn vị, lệch 6%. Đây là thứ
  làm hai con trông như ra từ một bàn tay. Máy rất hay co mắt Tim theo thân nhỏ
  hơn; mất cái này là hỏng cả bộ.
- **Thân Tim bằng 88.5% thân Não.**

> **Một chỗ trôi, ghi ra cho minh bạch.** Ảnh gốc của team đo được tỉ lệ thân
> **93%**; ba ảnh chuẩn ra **88.5%**. Lệch 4.5 điểm, nhìn thì thấy Tim hơi nhỏ
> hơn bản gốc một chút. Đã chấp nhận, vì ảnh chuẩn mới là thứ được đính kèm mọi
> lần sau, nên nó là cái thực sự được nhân bản. Muốn kéo về 93% thì phải sinh
> lại cả ba.

### Kính và tai nghe

| | |
|---|---|
| Tròng kính — đường kính | **3.6** (rộng hơn mắt 2.6 một khoảng rõ rệt) |
| Gọng kính — dày | **0.2** — mảnh như nét thân, và là **mực đen**, không ám tím |
| Cầu nối hai tròng — dày | 0.2 |
| Chụp tai — đường kính | 2.8 |
| Vòng cung tai nghe — dày | 0.5 |

Lý do hai con số đầu quan trọng: ở bản cũ, gọng kính dày hơn nét thân và tròng
kính gần bằng mắt, nên **hai vòng đen chồng lên nhau thành một mảng** — ở cỡ nhỏ
Não mất mặt. Tròng rộng hơn mắt thì có khoảng trắng thở giữa con ngươi và gọng.

**Dưới 32px:** kính rụng xuống còn một nét ngang, tai nghe bỏ hẳn — giống cách
logo bỏ linh vật ở cỡ favicon. Dưới 20px thì chỉ còn khối thân.

### Viền có hai tầng, không phải một

Đây là chỗ bản hợp đồng trước ghi sai, và sai này đắt: nó bảo viền toàn bộ là
mực đen, còn liệt `coloured outline` vào danh sách cấm — tức là **cấm đúng cái
thiết kế của team**. Đo lại `anh-goc.webp` thì luật thật là:

| | Viền | Đo được ở ảnh gốc |
|---|---|---|
| **Thân Não** | tím sẫm hơn thân | `#5F66AC` |
| **Thân Tim** | đỏ sẫm hơn thân | `#8F404A` |
| **Tay, chân, bàn tay, bàn chân** | mực đen | `#0B0B12` |
| **Kính** | mực đen | `#0B0B12` |
| **Tai nghe** | mực đen | `#0B0B12` |

**Tròng mắt là trắng thật `#FFFFFF`**, không phải màu nền. Ảnh gốc dùng trắng
tinh cho tròng mắt, và đó là màu thứ chín của bộ — thiếu nó thì mắt chìm vào nền.

Luật một câu: **thân thì viền ám màu của chính nó, mọi thứ gắn vào thân thì
viền mực.** Nó làm thân thấy mềm và hữu cơ, còn phụ kiện thấy là đồ vật — một
quyết định thiết kế tốt, và chính vì nó tinh nên dễ bị san phẳng thành "viền
đen hết".

Bề dày đo được ở ảnh gốc: thân Não **0.19 đơn vị**, thân Tim **0.26**. Không
phải 0.45 như bản trước ghi.

> **Cách bắt lỗi này nhanh nhất:** lấy pixel sẫm nhất ngay sát mép thân. Dưới
> độ sáng 40 là mực — tức là sai. Khoảng 85–115 mới đúng.
> `scripts/do-linh-vat.mjs` in thẳng con số đó ra.

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
The attached image or images are the style reference. Match their art style,
line, colour and proportions. Where an attachment and this text disagree about
how something LOOKS, the attachment wins. The NEVER list at the end always wins
and is never overridden by anything you see in an attachment.

If more than one image is attached they are the same two characters drawn the
same way; treat them as one reference, not as two options to choose between.

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
height as 10 units: the brain's body is 13.1 wide, the heart's is 8.85 tall and
9.1 wide. BOTH characters have eyes of the same size, about 2.5 units across.
The brain's eye centres sit at 51% of its body height from the bottom and 4.6
apart; the heart's at 57% and 4.2 apart. A heart with smaller eyes than the
brain is a failed drawing — that is the single thing most often got wrong.

THE OUTLINE HAS TWO TIERS, and this is the easiest thing in the whole brief to
get wrong. Each BODY is outlined in a darker shade of its own colour — the
brain in #5F66AC, the heart in #8F404A — thin, about 0.2 units. Everything
ATTACHED to a body is outlined in true black ink #0B0B12: the arms, the legs,
the hands, the feet, the glasses, the headphones. A body outlined in black is a
failed drawing, and so is a limb outlined in colour.

THE GLASSES AND THE HEADPHONES are built, not stuck on. They are black ink,
unlike the body outline. Their rims are thin — about as thin as the body
outline, never thicker. Each lens is 3.6 across —
clearly wider than the 2.6 eye inside it — so a ring of white shows between
pupil and rim. If rim and pupil merge into one black mass, the lens is too
small; enlarge it.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight outline drawn with a confident hand
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

KEEP: brain body #9097DE outlined #5F66AC · heart body #D46B76 outlined
#8F404A · mint #9BE5C5 · ink #0B0B12 for limbs, glasses and headphones ·
white #FFFFFF for the eyes · paper #F5F4E9 · flat ellipse shadow #E0D8C8. Both characters share the SAME
face size — the heart's body is smaller, its eyes are not.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, blurred shadow, inner shadow,
a darker band inside a body's own outline, 3D, perspective on an accessory —
an ear cup or a lens is drawn flat and straight on, never turned to show its
side — texture, film grain, noise, speckle, blush cheeks, black outline around
a body, coloured outline on a limb or an accessory, the two bodies outlined in
different ways, variable line weight, sparkles, glow, halo, vignette, texture
overlay, stiff symmetrical stock pose, legs ending without feet, subject
floating with no ground contact, text, watermark, frame, contact sheet, grid,
panels, multiple poses in one image, turnaround, caption, label, number.

GIVE ME 3–5 VERSIONS of this request, as separate images — not one sheet,
not one image split into panels. Identical characters, identical style and
colours across all of them. What differs is the IDEA: another gag, another
pose, another piece of staging. Five jitters of the same drawing is a failed
answer. Number them in your reply, never inside the image.

REQUEST:
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

## Hợp đồng này chưa bao đến đâu

Phần trên đủ để giữ **nhân vật là ai** và **nó được dựng thế nào**: hình khối,
tỉ lệ, bảng màu, luật viền hai tầng. Đính ba ảnh chuẩn vào là một AI lạ vẽ ra
đúng hai con này.

Chưa đủ để giữ **nhân vật thay đổi thế nào**. Mà yêu cầu khác nhau thì khác
nhau đúng ở chỗ đó. Sáu lỗ, xếp theo mức đau:

**1. Không có từ vựng biểu cảm.** Hợp đồng bảo "biểu cảm mô tả bằng chữ trong
`REQUEST`" rồi dừng ở đó. Ba ảnh chuẩn chỉ có đúng một biểu cảm: cười khép nhẹ.
Nên "Não đang lo" ở yêu cầu này và "Não đang lo" ở yêu cầu sau sẽ ra hai khuôn
mặt khác nhau — mỗi máy tự bịa. Cần chốt bằng chữ: mắt biến dạng thế nào, có
lông mày không, miệng có mấy kiểu. **Đây là lỗ to nhất.**

**2. Chỉ có góc chính diện.** Mọi ảnh chuẩn đều nhìn thẳng. Yêu cầu nào cần
nghiêng hoặc quay lưng — tức là gần như mọi khung truyện — đều phải tự chế.

**3. Bàn tay không có luật.** Ảnh chuẩn cho thấy bàn tay xoè bốn ngón, nhưng
chữ không nói gì. Tư thế chỉ trỏ, cầm nắm, ôm thì mỗi máy vẽ một kiểu tay.

**4. Hai nhân vật tương tác thì chưa có luật.** Ảnh chuẩn cố tình để hai con
tách hẳn và không chạm nhau, còn `NEVER` thì cấm chúng chồng lên nhau. Truyện
thì cần chúng chạm, che nhau, đứng trước sau. Lúc đó ai che ai, con ở xa nhỏ đi
bao nhiêu — chưa có gì, và luật hiện hành còn đang cấm.

**5. Không có ví dụ `REQUEST` đã điền.** Có khối prompt nhưng không có một dòng
yêu cầu mẫu nào. Người dùng sau phải tự đoán độ chi tiết: tả tư thế tới đâu, tả
biểu cảm tới đâu, nói hay không nói bố cục.

**6. Nền và bóng mới chỉ có một trường hợp.** Nền kem, nhân vật đứng, bóng
ellipse dưới chân. Ảnh dùng trong app thì nền gì? Nhân vật nhảy, ngồi, nằm thì
bóng ra sao? Chưa có.

Bốn lỗ đầu đều chữa bằng cùng một cách: **thêm ảnh chuẩn, mỗi ảnh một việc** —
đúng nguyên tắc ở mục "Ba ảnh tham chiếu". Một tờ gộp nhiều biểu cảm thì không
được, vì máy sẽ chép cái lưới; phải mỗi biểu cảm một ảnh, và chốt bằng chữ
trước khi sinh.

## Nhận ảnh về thì soi tám thứ

1. **Không có hình người** — chỉ một khối thân cộng bốn nét tay chân. Thấy vai, ngực, eo, hay một cái đầu đặt trên một thân người là trượt.
2. **Màu bệt và nét đều** — thấy chuyển sắc, bóng mềm hay nét lúc dày lúc mỏng là trượt.
3. **Viền đúng tầng** — thân ám màu (`#5F66AC` · `#8F404A`), tay chân và phụ kiện mực đen. Thân viền đen là trượt, dù nhìn vẫn thấy "sạch".
4. **Mặt hai nhân vật cùng cỡ** — AI rất hay co mặt Tim theo thân nhỏ hơn. Mất cái này là hai nhân vật trông như hai nhà khác nhau. Giờ kiểm được bằng thước: thân Tim bằng 88.5% thân Não, mắt lệch nhau dưới 6%.
5. **Không có chữ trong ảnh** — kể cả chữ nhỏ trong bong bóng thoại.
6. **Không có mùi AI** — nét run hoặc hở ở chỗ tay chân nối vào thân, bàn tay bàn chân nhoè, hai bên gần đối xứng mà lệch nhẹ, hào quang mờ quanh viền, lấp lánh hay vân nền không ai yêu cầu, và tư thế đứng đơ không diễn gì.
7. **Kính không bít mắt** — phải thấy rõ khoảng trắng giữa con ngươi và gọng. Gọng dày bằng nét thân, không dày hơn.
8. **Thu nhỏ còn 32px vẫn đọc được** — cách kiểm rẻ nhất cho mọi lỗi ở trên. Chi tiết thừa ở cỡ lớn trông vô hại, ở cỡ nhỏ thành vệt bẩn.
