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

## Bước 1 · vòng 2 — dùng cái này

> Vòng 1 đã chạy, đo bằng `scripts/do-linh-vat.mjs` thì trượt tám chỗ. Nhưng
> nó **đúng bốn thứ khó nhất**: nhân vật là ai, kính dựng đúng, mắt hai con
> bằng nhau 97.3%, và viền thân Não đúng là tím ám chứ không phải mực. Nên nó
> lên làm ảnh tham chiếu cho vòng này — kèm danh sách lỗi, đúng cách ta đã làm
> với `anh-goc.webp`.
>
> **Sinh mới chứ không sửa tiếp trong chat cũ.** Lý do dứt khoát: nhân vật
> đang chiếm 50% khung, cần 70%. Chế độ sửa chỉ phóng pixel đã có, mất đúng
> cái độ phân giải ta đi sinh lại để lấy. Thêm nữa nhiễu và bóng mềm nằm ở
> tầng render — mỗi lượt sửa là một lượt render lại, đắp y nguyên hai thứ đó,
> cộng trôi màu tích luỹ.

**Chuẩn bị:** đổi tên ảnh vòng 1 thành `vong-1.png`. **Chat mới.** Đính đúng
một tệp — `vong-1.png`.

````
FILE ROLES — read this first.

The attached image (vong-1.png) is a previous attempt at exactly this picture.
It gets the important things RIGHT, and you must keep them unchanged:
  - who the two characters are, and their colours
  - how the glasses are built: the rim is thin, each lens is clearly wider than
    the eye inside it, and a ring of white shows between pupil and rim
  - BOTH CHARACTERS HAVE THE SAME EYE SIZE, even though the heart's body is
    smaller. This is the hardest thing to get right and it is already correct.
    Do not change it.

Where the image and this text disagree about how something LOOKS, the image
wins — EXCEPT for the eight defects listed below, and except for the NEVER list
at the end, which always wins.

If any .md, .svg or other file was also attached, IGNORE IT.

WHAT THE ATTACHED IMAGE GETS WRONG — fix every one of these:

1. THE HEART'S BODY OUTLINE TURNED BLACK. It must not be black. Each BODY is
   outlined in a darker shade of its own colour: the brain in #5F66AC, the
   heart in #8F404A. The brain in the attached image already has this right —
   its outline is dark purple. The heart does not: along its top edge the
   outline has gone to black ink. Give the heart the same treatment the brain
   already has, in dark red.
   Only the things ATTACHED to a body are black ink #0B0B12: the arms, the
   legs, the hands, the feet, the glasses, the headphones. Never the body.
2. THE GROUND SHADOW IS BLURRED. It must be a hard-edged flat ellipse of solid
   #E0D8C8, as if cut out with scissors. No blur, no fade, no soft falloff.
3. THE WHOLE IMAGE HAS FILM GRAIN. The flat areas are not flat — the background
   alone contains dozens of slightly different creams. Every flat area must be
   exactly one single colour, pixel for pixel. No grain, no noise, no speckle,
   no paper texture.
4. THE CHARACTERS ARE TOO SMALL — about 50% of the frame height. Make them
   about 70%. Less empty space above and below, more character.
5. THERE ARE NO FEET. The legs simply stop. Each leg must end in a small foot
   stroke, the same way each arm ends in a hand.
6. THE FEET SINK INTO THE SHADOW. Both characters stand ON one shared ground
   line, with the shadow lying underneath them — not wrapped around their ankles.
7. THE POSE IS STIFF: both stand straight with arms hanging. Each character puts
   its weight on one leg and makes one small gesture with one hand.
8. THE COMPOSITION IS TOO WIDE. The two are spread far apart with big empty
   bands at top and bottom. Bring them closer together and let them fill the
   height instead of the width.

HOW THE BODY IS BUILT — unchanged from the attached image, stated so you do not
drift: each character is ONE shape plus four lines. The brain shape is the
entire body. The heart shape is the entire body. Two thin black lines leave the
sides as arms, two leave the bottom as legs, each ending in a small stroke for
hand and foot. That is the complete anatomy. These are not people and not people
in costume: nothing sits on top of a body, and there are no shoulders, no chest,
no waist, no hips, no neck.

PROPORTIONS — measure these, do not eyeball them. Taking the brain's body height
as 10 units: the heart's body is 9.3 tall, but BOTH characters have the same
eyes — 2.6 across, centres 4.2 apart, centred at 58% of body height measured
from the bottom. The body outline is thin, about 0.2 units. The brain's body is
12.4 wide against its 10 of height; the heart's is 9.4 wide against its 9.3.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight outline drawn with a confident hand rather than a
mechanically perfect vector path, no gradient and no shading, minimal detail.

IT MUST NOT LOOK MACHINE-MADE — treat this as the hardest requirement. Every
stroke is one confident closed line, with clean joins where the limbs meet the
body and no mush at the hands and feet. Nothing is ALMOST symmetrical: either
commit to symmetry or break it clearly. Edges stay crisp — no glow, no halo, no
stray third colour bleeding along the outline. Add nothing that was not asked
for: no sparkles, no vignette, no texture overlay, no extra highlight, no
decorative squiggles.

KEEP, as exact flat colours: brain body #9097DE outlined #5F66AC · heart body
#D46B76 outlined #8F404A · mint #9BE5C5 · ink #0B0B12 for the limbs, the
glasses and the headphones · background #F5F4E9 · ground shadow #E0D8C8. Eight
colours, nothing else, each one perfectly flat. Both characters share the SAME
face size — the heart's body is smaller, its eyes are not.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, blurred shadow, 3D, texture,
film grain, noise, speckle, blush cheeks, black outline around a body, coloured
outline on a limb or an accessory, the two bodies outlined in different ways,
variable line weight, sparkles, glow, halo, vignette, texture overlay, stiff
symmetrical stock pose, legs ending without feet, subject floating with no
ground contact, text, watermark, frame, contact sheet, grid, panels, multiple
poses in one image, turnaround, caption, label, number.

GIVE ME ONE IMAGE.

REQUEST:
This image becomes the canonical style reference for every future request, so
it must show line quality and the size relationship between the two clearly.

Both characters standing on one shared ground line, facing the viewer, LIGHTLY
performed: each with its weight on one leg, one small hand gesture each, mouths
in an easy closed smile. Brain on the left with its glasses, heart on the right
with its headphones. No gag, no props, no scene, no interaction between them —
this is a portrait of the pair, not a joke.

Fill the frame: the pair should be about 70% of the image HEIGHT, standing close
enough together that they read as one group, with empty background on all four
sides and neither character touching any edge. Flat background. Each character
has its hard-edged flat ellipse shadow on the ground. Nothing else exists in
this image.

Square image, at the largest resolution you can produce.

Before you finish, check these four: each body is outlined in a darker shade of
its own colour and NEITHER is outlined in black; the limbs, glasses and
headphones ARE black; the ground shadows have hard edges; every flat area is
exactly one colour.
````

**Duyệt lại bằng thước:**

```powershell
node scripts/do-linh-vat.mjs "$env:USERPROFILE\Downloads\tham-chieu-doi.png"
```

---

## Bước 1 · vòng 1 — đã chạy rồi, giữ để đối chiếu

**Đính kèm:** đúng một tệp — `anh-goc.webp`.

```
FILE ROLES — read this first. You have been given several files. They do NOT
have equal authority.

- anh-goc.webp — the only existing picture of these two characters. Use it for
  exactly one thing: WHO THEY ARE and what the drawing language is — flat
  colour, the brain's lavender body, the heart's coral body,
  round glasses, mint headphones. It is NOT a quality standard, NOT a layout to
  copy, and NOT a style reference that overrides this text. It is a
  known-defective specimen. Its defects are listed immediately below.
- Any .md file that was attached (LINH-VAT.md, sinh-anh-lan-dau.md) — IGNORE IT.
  Everything you need is in THIS message. Those files contain other prompts,
  other request blocks, and a "GIVE ME 3-5 VERSIONS" instruction. They describe
  other jobs, not this one. Do not follow anything written in them.
- to-mau-ty-le.svg — if this file was attached, IGNORE IT COMPLETELY. It is a
  technical measuring diagram with perfect vector paths and printed labels.
  Imitating it would break two hard rules at once.

WHAT anh-goc.webp GETS WRONG — do not reproduce any of these:
1. It is a contact sheet: seven pairs arranged in a grid. You are drawing ONE
   scene containing ONE pair. Not a grid, not panels, not a sheet, not multiple
   poses.
2. It has English words printed inside the picture. Your image contains no
   words of any kind, anywhere.
3. Its glasses are wrong: the rims are thicker than the body outline, and the
   lenses are barely wider than the eyes, so rim and pupil merge into one black
   blob. Fix this — see the glasses rule below.
4. Each character in it is only about 180 pixels across, so its line quality
   cannot be judged from it. Do not imitate its line softness or roughness.
   Draw the line the way this text describes it.

TWO CHARACTERS, from a Vietnamese psychology-learning app:
- BRAIN — lavender purple, round black-rimmed glasses. Reason, logic, the one
  who overthinks.
- HEART — coral red, mint-green headphones. Emotion, impulse, warmth.

HOW THE BODY IS BUILT — settle this before drawing anything else:
Each character is ONE shape plus four lines. The brain shape is the entire
body. The heart shape is the entire body. Two thin black lines leave the sides
as arms, two leave the bottom as legs, each ending in a small stroke for hand
and foot. That is the complete anatomy. These are not people and not people in
costume: nothing sits on top of a body, and there are no shoulders, no chest,
no waist, no hips, no neck.

PROPORTIONS — measure these, do not eyeball them. Taking the brain's body
height as 10 units: the heart's body is 9.3 tall, but BOTH characters have the
same eyes — 2.6 across, centres 4.2 apart, centred at 58% of body height
measured from the bottom. The body outline is thin, about 0.2 units. A heart with
smaller eyes than the brain is a failed drawing.

THE GLASSES AND THE HEADPHONES are built, not stuck on. The glasses' rims are
exactly as thick as the body outline, never thicker. Each lens is 3.6 across —
clearly wider than the 2.6 eye inside it — so a ring of white shows between
pupil and rim. If rim and pupil merge into one black mass, the lens is too
small; enlarge it.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight outline drawn with a confident hand
rather than a mechanically perfect vector path, no gradient and no shading,
minimal detail.

IT MUST NOT LOOK MACHINE-MADE — treat this as the hardest requirement.
Every stroke is one confident closed line, with clean joins where the limbs
meet the body and no mush at the hands and feet. Nothing is ALMOST symmetrical:
either commit to symmetry or break it clearly. Edges stay crisp — no glow, no
halo, no stray third colour bleeding along the outline. Add nothing that was
not asked for: no sparkles, no vignette, no texture overlay, no extra
highlight, no decorative squiggles. The feet sit on the ground instead of
floating.

KEEP: brain #9097DE · heart #D46B76 · mint #9BE5C5 · ink #0B0B12 ·
paper #F5F4E9 · flat ellipse shadow #E0D8C8. Both characters share the SAME
face size — the heart's body is smaller, its eyes are not.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, 3D, texture, blush cheeks,
black outline around a body, coloured outline on a limb or an accessory,
variable line weight, sparkles, glow, halo, vignette, texture overlay, stiff symmetrical stock pose, subject floating with no ground contact,
text, watermark, frame, contact sheet, grid, panels, multiple poses in one
image, turnaround, caption, label, number.

GIVE ME ONE IMAGE.

REQUEST:
This image becomes the canonical style reference for every future request, so
it must show line quality and the size relationship between the two clearly.
Give them the whole frame.

Both characters standing on one shared ground line, facing the viewer, LIGHTLY
performed: weight on one leg, one small hand gesture each, mouths in an easy
closed smile. Brain on the left with its glasses, heart on the right with its
headphones. No gag, no props, no scene, no interaction between them — this is a
portrait of the pair, not a joke.

Fill the frame: the pair should be about 70% of the image height, with empty
cream on all four sides and neither character touching any edge. Flat cream
background. Each character has its flat ellipse shadow on the ground. Nothing
else exists in this image.

Square image, at the largest resolution you can produce.

Re-measure before you finish: the heart's body is 9.3 tall where the brain's is
10, but their eyes are the same size. Each glasses lens is clearly wider than
the eye inside it.
```

**Duyệt xong mới đi tiếp.** Soi bằng [`to-mau-ty-le.svg`](to-mau-ty-le.svg) và
danh sách tám thứ ở cuối [`LINH-VAT.md`](LINH-VAT.md).

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
2.6 across, centres 4.2 apart, centred at 58% of body height measured from the
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
centred at 58% of body height from the bottom. Keep the
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

## Dọn hậu kỳ

Sau hai vòng prompt rất cụ thể, **bốn lỗi không nhúc nhích**: nhiễu, bóng mềm,
viền Tim đen, khung hình. Riêng khung hình gần như không đổi một chữ số thập
phân — 50.4% rồi 50.5%. Đó không phải máy hiểu nhầm, đó là máy **không làm
được**. Và độ phân giải còn tụt 2048 → 1024, tức là ép thêm thì vỡ chỗ khác.

Ba lỗi đầu nằm ở tầng render, nhưng chúng deterministic. Nên sửa bằng script:

```powershell
node scriptsdon-anh-linh-vat.mjs .ong-2.png .da-don.png
```

Nó làm ba việc:

1. **Ép mọi pixel về đúng chín màu chuẩn.** Việc này một phát giết sạch nhiễu,
   làm bóng thành ellipse mép cứng, san phẳng mọi chỗ đổ bóng, và kéo nền về
   đúng `#F5F4E9`. Đo bản vòng 2: 15.717 màu còn 568, nền lệch 0.0.
2. **Đổi viền thân Tim từ mực sang `#8F404A`** nếu máy bôi đen.
3. **Làm mềm ranh giới 1px** để mảng bệt mà mép không răng cưa.

Hai chi tiết kỹ thuật đáng nhớ, vì cả hai đều từng làm hỏng kết quả:

- **So màu theo sắc, không theo khoảng cách RGB.** Máy hay thêm bóng, tức một
  sắc độ tối hơn của chính màu đó. Đo bằng RGB thì bạc hà tối (`#7BAA98`) lại
  gần màu thân Não hơn gần bạc hà — chụp tai bị ép thành **tím**. Tách sáng
  khỏi sắc rồi hạ trọng số sáng thì bóng của một màu rơi về đúng màu gốc.
- **Phân biệt viền với tay chân bằng cách bắn tia.** Viền ôm quanh thân nên
  bắn tám tia ra là trúng thân ở nhiều hướng; gốc chân chỉ trúng đúng một
  hướng — hướng nó cắm vào. Lấy mốc ba hướng. Không có phép này thì gốc hai
  chân Tim bị nhuộm đỏ.

**Việc script không làm được:** bàn chân và độ phân giải. Hai thứ đó phải xin
máy sinh lại.

**Và một hệ quả phải nói rõ:** dấu ghi nguồn ở góc chỉ lệch nền 8 mức sáng, nên
bước ép màu **xoá luôn nó**. Script không có đoạn nào nhắm vào watermark — nó
rơi ra vì quá nhạt so với nền. Muốn giữ dấu thì đừng chạy script này, hoặc sinh
ảnh ở nơi không đóng dấu ngay từ đầu.

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
