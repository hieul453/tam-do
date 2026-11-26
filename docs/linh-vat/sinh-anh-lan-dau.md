# Sinh ba ảnh tham chiếu lần đầu — bằng Gemini

> Tài liệu dùng một lần. Sinh xong ba ảnh đạt chuẩn thì xoá file này đi; từ đó
> trở về sau chỉ cần [`LINH-VAT.md`](LINH-VAT.md).

## Vấn đề của lần đầu

Mọi lần sinh ảnh về sau đều có ảnh tham chiếu tốt để đính kèm. **Lần này thì
chưa.** Thứ duy nhất đang có là `anh-goc.webp`, và nó hỏng ở đúng ba chỗ mà ta
đang muốn sửa:

- là **tờ gộp bảy cặp xếp lưới** — máy khớp cả bố cục, nên dễ nhận về một tờ lưới nữa
- **có chữ in trong ảnh** — trái luật số 4, và theo quy tắc ưu tiên thì ảnh đang dạy máy rằng được viết chữ
- **kính bị bít** — gọng dày hơn nét thân, tròng gần bằng mắt

Mà hợp đồng lại ghi *"ảnh thắng chữ về mặt hình thức"*. Đính nó vào rồi im lặng
thì ba lỗi đó thắng.

Cách xử lý: **không im lặng.** Prompt dưới đây hạ `anh-goc.webp` từ "ảnh phong
cách" xuống "mẫu vật có lỗi, lỗi liệt kê sẵn" — máy vẫn lấy được nhân vật và
ngôn ngữ vẽ từ nó, nhưng biết rõ cái gì không được chép.

## Ba tệp, ba vai khác nhau

Ném cả folder thì máy phải tự đoán tệp nào quan trọng. **Đừng để nó đoán.** Mỗi
prompt dưới đây mở đầu bằng bảng vai trò, gọi thẳng tên file.

**Đính đúng một tệp mỗi lượt: ảnh.** Không kéo cả folder.

| Tệp | Đính kèm? | Vì sao |
|---|---|---|
| `anh-goc.webp` | **Bước 1 có, bước 2–3 không** | Chỉ để biết hai nhân vật là ai và ngôn ngữ vẽ thế nào. Không phải chuẩn chất lượng |
| `tham-chieu-doi.png` | **Bước 2–3**, sau khi duyệt | Ảnh phong cách thật sự, từ bước 2 trở đi |
| `LINH-VAT.md` | **Không** | Prompt dưới đây đã tự đủ. Còn file hợp đồng chứa **một prompt khác** cộng ba khối `REQUEST` khác — đính vào là cho máy hai bản chỉ dẫn để chọn |
| `sinh-anh-lan-dau.md` | **Không** | Chính file này. Nó chứa cả ba prompt, kể cả hai prompt của bước sau |
| `to-mau-ty-le.svg` | **Không** | Vector sạch tuyệt đối cộng chữ — đúng hai thứ `NEVER` cấm. Tờ cho người duyệt, không phải cho máy |

Prompt vẫn có câu chặn cho cả bốn tệp kia, phòng lúc tiện tay kéo nhầm. Nhưng
câu chặn chỉ là lưới an toàn — **ít tệp thì ít chỗ để máy hiểu sai**.

## Làm theo thứ tự, đừng sinh song song

Ba ảnh này sẽ là chuẩn cho mọi ảnh về sau. Nếu chúng **lệch nhau**, mọi ảnh
tương lai thừa kế luôn chỗ lệch đó — và lúc ấy không còn gì để đối chiếu nữa.

Nên sinh nối tiếp, không sinh song song:

1. **Ảnh đôi trước.** Duyệt bằng `scripts/do-linh-vat.mjs` và danh sách bảy
   thứ trong hợp đồng. Chưa đạt thì sinh lại, **chưa được đi tiếp** — mỗi vòng
   lấy ảnh vòng trước làm tham chiếu, kèm danh sách lỗi đo được.
2. **Ảnh Não**, đính **ảnh đôi vừa duyệt** — không đính `anh-goc.webp` nữa.
3. **Ảnh Tim**, cũng đính ảnh đôi vừa duyệt.

Lý do: từ bước 2 trở đi đã có một ảnh sạch để làm chuẩn. Dùng nó thì lỗi của
`anh-goc.webp` chỉ có một cửa để lọt, thay vì ba cửa độc lập.

## Cỡ ảnh

Hợp đồng đòi 2048×2048, tối thiểu 1536. **Tôi chưa kiểm được bản Gemini bạn đang
dùng xuất được tới cỡ nào** — cứ yêu cầu lớn nhất có thể rồi xem nhận về bao
nhiêu.

Nếu chỉ được 1024 thì vẫn dùng được, và đây là lý do: chỗ hỏng của
`anh-goc.webp` không phải con số 1024, mà là **1024 chia cho bảy cặp**. Một
nhân vật chiếm 70% khung 1024 thì cao khoảng 700px — gấp gần bốn lần ảnh cũ.
Đủ để đọc chất nét. Ảnh đôi ở 1024 thì mỗi con khoảng 450px, vẫn gấp hơn hai lần.

Cứ sinh ở cỡ lớn nhất nhận được. Thiếu thì phóng sau, đừng chặn ở đây.

---

## Bước 1 · vòng 4 — dùng cái này

> Ảnh vòng 3 đúng gần hết: 2048, mắt hai con 100.8%, thân 93.4%, cả hai viền
> ám màu, tâm mắt đúng. Hỏng đúng một chỗ: **chụp tai của Tim lấn sang vùng
> của Não.** Thân hai con cách nhau 115px, nhưng chụp tai thò sang trái quá
> mép Não.
>
> Tách hẳn ra thì cặp rộng thêm, tỉ lệ lên 1.79 — và trong khung vuông, phần
> trăm chiều cao còn **tụt** xuống 47%. Nên vòng này đổi luôn khung:
> **ảnh ngang 3:2.** Tính ra 2237×1500 là vừa khít cho cặp tách rời chiếm 70%
> chiều cao với lề 8%. Một thay đổi gỡ được cả hai nút.
>
> Prompt vòng 3 trong lịch sử git, commit `3c912c6`.

**Chuẩn bị:** đổi tên ảnh vòng 3 thành `doi-v3.png`. **Chat mới.** Đính đúng
một tệp đó.

````
FILE ROLES — read this first.

The attached image (doi-v3.png) is the same picture you are about to draw, and
it is very nearly right. Keep everything about it except the six points listed
below.

COPY FROM IT EXACTLY:
  - THE BODY OUTLINES. Each body is outlined in a darker shade of its OWN
    colour, never in black — the brain in dark purple, the heart in dark red.
    The attachment already does this correctly.
  - THE BLACK INK, used only for the arms, the legs, the hands, the glasses and
    the headphones. Never for a body.
  - THE EYES. Both characters' eyes are exactly the same size, even though the
    heart's body is smaller. Measure them in the attachment and keep them equal.
  - The eye heights: the brain's eye centres sit a little above the middle of
    its body, the heart's a little higher than that. Both are correct already.
  - The line weight, the flat colours, the body shapes, the glasses, the
    headphones, and how much of the frame each character fills.

Where the attachment and this text disagree about how something LOOKS, the
attachment wins — EXCEPT for the six points below, and except for the NEVER
list at the end, which always wins.

If any other file was attached, IGNORE IT.

WHAT TO CHANGE — six things, nothing else:

1. THEY OVERLAP. The heart's left ear cup crosses into the brain's space. Move
   them apart. There must be a clear channel of empty background between the
   two characters, running from the top of the picture to the bottom, that
   nothing crosses — not an ear cup, not a headphone band, not a hand, not an
   arm. Each character must be readable as a complete separate shape.
2. THE PICTURE IS SQUARE. Make it a LANDSCAPE picture, 3:2 — half again as wide
   as it is tall. The extra width is what lets them stand apart.
3. NO FEET. Both characters' legs simply stop. Each leg must end in a small
   foot stroke, the same way each arm already ends in a hand.
4. THE GROUND SHADOW IS BLURRED. Each must be a hard-edged flat ellipse, as if
   cut out with scissors. No blur, no fade, no soft falloff.
5. FILM GRAIN. The flat areas are not flat — the background alone contains
   dozens of slightly different creams. Every flat area must be exactly one
   colour, pixel for pixel. No grain, no noise, no speckle, no paper texture.
6. THE HEART'S EAR CUP IS DRAWN IN PERSPECTIVE — you can see the side of it, as
   if it were a solid object turned slightly. Draw it flat and straight on,
   like everything else in the picture.

HOW THE BODY IS BUILT — unchanged, stated so you do not drift: each character
is ONE shape plus four lines. The brain shape is the entire body. The heart
shape is the entire body. Two thin black lines leave the sides as arms, two
leave the bottom as legs, each ending in a small stroke for hand and foot. That
is the complete anatomy. These are not people and not people in costume:
nothing sits on top of a body, and there are no shoulders, no chest, no waist,
no hips, no neck.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight outline drawn with a confident hand rather than a
mechanically perfect vector path, no gradient and no shading, minimal detail.

IT MUST NOT LOOK MACHINE-MADE — treat this as the hardest requirement. Every
stroke is one confident closed line, with clean joins where the limbs meet the
body and no mush at the hands and feet. Nothing is ALMOST symmetrical: either
commit to symmetry or break it clearly. Edges stay crisp — no glow, no halo, no
stray third colour bleeding along an outline. Add nothing that was not asked
for: no sparkles, no vignette, no texture overlay, no extra highlight, no
decorative squiggles.

KEEP, as exact flat colours: brain body #9097DE outlined #5F66AC · heart body
#D46B76 outlined #8F404A · mint #9BE5C5 · ink #0B0B12 for the limbs, the
glasses and the headphones · background #F5F4E9 · ground shadow #E0D8C8. Eight
colours, nothing else, each one perfectly flat across its whole area.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, blurred shadow, 3D, texture,
film grain, noise, speckle, blush cheeks, black outline around a body, coloured
outline on a limb or an accessory, the two bodies outlined in different ways,
the two characters touching or overlapping, variable line weight, sparkles,
glow, halo, vignette, texture overlay, stiff symmetrical stock pose, legs
ending without feet, subject floating with no ground contact, text, watermark,
frame, contact sheet, grid, panels, multiple poses in one image, turnaround,
caption, label, number.

GIVE ME ONE IMAGE.

REQUEST:
The same two characters as in the attachment, standing on one shared ground
line, facing the viewer, clearly apart from each other. Brain on the left with
its glasses, heart on the right with its headphones. Each with its weight on
one leg and one small hand gesture, mouth in an easy closed smile — the same
light performance the attachment already has. No gag, no props, no scene, and
no interaction between them: they are standing side by side, not doing
something together.

This picture becomes the canonical style reference for every future request, so
it must show both characters complete and separate. The pair should fill about
70% of the image HEIGHT, with empty background above, below, and on both
outer sides, and a clear band of empty background between them. Flat
background. Each has its own hard-edged flat ellipse shadow, and the two
shadows do not touch. Nothing else in the picture.

A LANDSCAPE image, 3:2 — about 2250 wide by 1500 tall. If you can only produce
one aspect ratio, produce the widest you have; do not give me a square.

Before you finish, check these three: a clear band of background runs between
the two characters, top to bottom, with nothing crossing it; the two eyes pairs
are the same size; neither body is outlined in black.
````

**Duyệt lại bằng thước:**

```powershell
node scripts/do-linh-vat.mjs "$env:USERPROFILE\Downloads\tham-chieu-doi.png"
```

---

## Bước 2 — `tham-chieu-nao.png`

**Đính kèm:** đúng một tệp — `tham-chieu-doi.png` vừa duyệt.
**`anh-goc.webp` đã hết việc**, đừng đính nữa.

```
FILE ROLES — read this first.

- tham-chieu-doi.png — THIS is the style reference, and it is authoritative.
  Match its art style, line weight, colour, eye size and proportions exactly.
  Where it and this text disagree about how something LOOKS, the image wins.
  You are redrawing the same character that appears in it, alone — not
  designing a new one.
- Any .md file that was attached (LINH-VAT.md, sinh-anh-lan-dau.md) — IGNORE IT.
  Everything you need is in THIS message. Those files contain other prompts,
  other request blocks, and a "GIVE ME 3-5 VERSIONS" instruction. They describe
  other jobs, not this one. Do not follow anything written in them.
- anh-goc.webp — if this file was attached, IGNORE IT COMPLETELY. It is an
  older, defective version that has been replaced by tham-chieu-doi.png.
- to-mau-ty-le.svg — if this file was attached, IGNORE IT COMPLETELY. It is a
  technical measuring diagram with perfect vector paths and printed labels.

The NEVER list at the end always wins and is never overridden by anything you
see in any attached image.

HOW THE BODY IS BUILT: one shape plus four lines. The brain shape is the entire
body. Two thin black lines leave the sides as arms, two leave the bottom as
legs, each ending in a small stroke for hand and foot. That is the complete
anatomy. This is not a person and not a person in costume: nothing sits on top
of a body, and there are no shoulders, no chest, no waist, no hips, no neck.

PROPORTIONS — measure, do not eyeball. Taking the body height as 10 units: eyes
2.6 across, centres 4.2 apart, centred at 52% of body height measured from the
bottom. Body outline about 0.2 units thick. Arms 5.5 long, attached at 55% of body height from
the bottom. Legs 3.8 long.

THE GLASSES are built, not stuck on. They are BLACK INK, unlike the body
outline, which is dark purple. The rims are thin, about as thin as the body
outline, never thicker. Each lens is 3.6 across — clearly wider than the 2.6
eye inside it — so a ring of white shows between pupil and rim. If rim and
pupil merge into one black mass, the lens is too small; enlarge it.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight outline drawn with a confident hand
rather than a mechanically perfect vector path, no gradient and no shading,
minimal detail.

IT MUST NOT LOOK MACHINE-MADE — treat this as the hardest requirement.
Every stroke is one confident closed line, with clean joins where the limbs
meet the body and no mush at the hand and foot. Nothing is ALMOST symmetrical:
either commit to symmetry or break it clearly. Edges stay crisp — no glow, no
halo, no stray third colour bleeding along the outline. Add nothing that was
not asked for: no sparkles, no vignette, no texture overlay, no extra
highlight, no decorative squiggles. The feet sit on the ground instead of
floating.

KEEP: brain body #9097DE outlined #5F66AC · ink #0B0B12 for the limbs and the
glasses · paper #F5F4E9 · flat ellipse shadow #E0D8C8. The body outline is a
dark purple, NOT black. The limbs and the glasses ARE black.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, 3D, texture, blush cheeks,
black outline around a body, coloured outline on a limb or an accessory,
variable line weight, sparkles, glow, halo, vignette, texture overlay, stiff symmetrical stock pose, subject floating with no ground contact,
text, watermark, frame, contact sheet, grid, panels, multiple poses in one
image, turnaround, caption, label, number.

GIVE ME ONE IMAGE.

REQUEST:
The BRAIN alone, nothing else in the frame. Same character as in
tham-chieu-doi.png, same size eyes, same line weight, same colour.

Facing the viewer, lightly performed: weight on one leg, one hand making a
small gesture, easy closed smile, glasses on. No props, no gag, no scene.

Fill the frame: about 70% of the image height, empty cream on all four sides,
not touching any edge. Flat cream background, its flat ellipse shadow on the
ground, nothing else.

Square image, at the largest resolution you can produce.

The glasses are the thing to get right here: rims exactly as thick as the body
outline, each lens clearly wider than the eye inside it, a visible ring of
white between pupil and rim.
```

---

## Bước 3 — `tham-chieu-tim.png`

**Đính kèm:** đúng một tệp — `tham-chieu-doi.png` vừa duyệt.
**`anh-goc.webp` đã hết việc**, đừng đính nữa.

```
FILE ROLES — read this first.

- tham-chieu-doi.png — THIS is the style reference, and it is authoritative.
  Match its art style, line weight, colour, eye size and proportions exactly.
  Where it and this text disagree about how something LOOKS, the image wins.
  You are redrawing the same character that appears in it, alone — not
  designing a new one.
- Any .md file that was attached (LINH-VAT.md, sinh-anh-lan-dau.md) — IGNORE IT.
  Everything you need is in THIS message. Those files contain other prompts,
  other request blocks, and a "GIVE ME 3-5 VERSIONS" instruction. They describe
  other jobs, not this one. Do not follow anything written in them.
- anh-goc.webp — if this file was attached, IGNORE IT COMPLETELY. It is an
  older, defective version that has been replaced by tham-chieu-doi.png.
- to-mau-ty-le.svg — if this file was attached, IGNORE IT COMPLETELY. It is a
  technical measuring diagram with perfect vector paths and printed labels.

The NEVER list at the end always wins and is never overridden by anything you
see in any attached image.

HOW THE BODY IS BUILT: one shape plus four lines. The heart shape is the entire
body. Two thin black lines leave the sides as arms, two leave the bottom as
legs, each ending in a small stroke for hand and foot. That is the complete
anatomy. This is not a person and not a person in costume: nothing sits on top
of a body, and there are no shoulders, no chest, no waist, no hips, no neck.

PROPORTIONS — measure, do not eyeball. This is the critical part of this
image. In tham-chieu-doi.png the heart's body is 9.3 units tall where the
brain's is 10 — but their eyes are IDENTICAL: 2.6 across, centres 4.2 apart,
centred at 57% of body height from the bottom. Keep the
eyes at exactly that size. Arms 5.5 long, attached at 55% of body height from
the bottom. Legs 3.8 long.

THE HEADPHONES are built, not stuck on. Mint green with a BLACK INK outline,
unlike the body outline, which is dark red. Each ear cup 2.8 across, the
connecting band 0.5 thick.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight outline drawn with a confident hand
rather than a mechanically perfect vector path, no gradient and no shading,
minimal detail.

IT MUST NOT LOOK MACHINE-MADE — treat this as the hardest requirement.
Every stroke is one confident closed line, with clean joins where the limbs
meet the body and no mush at the hand and foot. Nothing is ALMOST symmetrical:
either commit to symmetry or break it clearly. Edges stay crisp — no glow, no
halo, no stray third colour bleeding along the outline. Add nothing that was
not asked for: no sparkles, no vignette, no texture overlay, no extra
highlight, no decorative squiggles. The feet sit on the ground instead of
floating.

KEEP: heart body #D46B76 outlined #8F404A · mint #9BE5C5 · ink #0B0B12 for the
limbs and the headphones · paper #F5F4E9 · flat ellipse shadow #E0D8C8. The body
outline is a dark red, NOT black. The limbs and the headphones ARE black.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, 3D, texture, blush cheeks,
black outline around a body, coloured outline on a limb or an accessory,
variable line weight, sparkles, glow, halo, vignette, texture overlay, stiff symmetrical stock pose, subject floating with no ground contact,
text, watermark, frame, contact sheet, grid, panels, multiple poses in one
image, turnaround, caption, label, number.

GIVE ME ONE IMAGE.

REQUEST:
The HEART alone, nothing else in the frame. Same character as in
tham-chieu-doi.png, same line weight, same colour.

Facing the viewer, lightly performed: weight on one leg, one hand making a
small gesture, easy closed smile, headphones on. No props, no gag, no scene.

Fill the frame: about 70% of the image height, empty cream on all four sides,
not touching any edge. Flat cream background, its flat ellipse shadow on the
ground, nothing else.

Square image, at the largest resolution you can produce.

The eyes are the thing to get right here. This character's body is smaller than
the brain's, and the eyes must NOT shrink with it: same diameter, same spacing,
same size as the brain's eyes in tham-chieu-doi.png. If the face looks smaller
than the brain's face, redraw it.
```

---

## Nhận ảnh về thì làm gì

**Chạy thước trước, mắt sau:**

```powershell
node scripts/do-linh-vat.mjs "$env:USERPROFILE\Downloads\tham-chieu-doi.png"
```

Vòng 1 cho thấy vì sao thứ tự đó quan trọng. Nhìn bằng mắt thì "đẹp hơn hẳn
bản cũ". Đo xong ra tám chỗ trượt, trong đó **hai chỗ mắt thường không bắt
được**: nhiễu grain phủ toàn ảnh, và watermark ở góc. Thước cũng bác lại ba
kết luận tôi rút ra bằng mắt — xem phần viền hai tầng trong LINH-VAT.md.

Thước đọc được: kích thước, bảng màu, độ bệt của từng thân, khung hình và lề,
tỉ lệ thân Tim trên thân Não, cỡ mắt hai bên, lát cắt qua kính, bề dày nét
viền, và watermark góc dưới phải.

Còn ba thứ phải tự nhìn:

- **Chân có bàn chân không**, và có đứng trên bóng không hay cắm vào giữa bóng
- **Tư thế có diễn không** hay đứng đơ tay buông
- **Thu nhỏ còn 32px có đọc được không** — phép thử rẻ bắt được gần hết lỗi
  còn lại. Chi tiết thừa ở cỡ lớn trông vô hại, ở cỡ nhỏ thành vệt bẩn.

## Watermark

Gemini đóng một ngôi sao bốn cánh ~96px ở góc dưới phải. Đó là **dấu ghi
nguồn — đừng xoá.** Cách sạch là sinh ở nơi không đóng dấu; thử AI Studio xem
ảnh ra có sao không. Chưa ai kiểm, nên cứ thử rồi chạy thước, dòng
`GÓC DƯỚI PHẢI` sẽ nói ngay.

Đạt rồi thì:

1. Lưu đúng ba tên: `tham-chieu-doi.png`, `tham-chieu-nao.png`, `tham-chieu-tim.png`
2. Xoá `anh-goc.webp`
3. Xoá file này
4. Gỡ ghi chú "Tình trạng hôm nay" ở đầu [`LINH-VAT.md`](LINH-VAT.md)
