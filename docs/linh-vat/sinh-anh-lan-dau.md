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

| Tệp | Đính kèm? | Vai |
|---|---|---|
| `anh-goc.webp` | **Bước 1 có, bước 2–3 không** | Chỉ để biết hai nhân vật là ai và ngôn ngữ vẽ thế nào. Không phải chuẩn chất lượng |
| `LINH-VAT.md` | Có, cả ba bước | Chữ. Nhưng **prompt dán vào thắng** khi hai bên khác nhau |
| `to-mau-ty-le.svg` | **Không. Gỡ ra** | Vector sạch tuyệt đối cộng chữ — đúng hai thứ `NEVER` cấm. Nó là tờ cho người duyệt, không phải cho máy |

Nếu tiện tay kéo cả folder thì prompt đã có câu chặn cho `to-mau-ty-le.svg`,
nhưng **gỡ nó ra vẫn tốt hơn**. Câu chặn chỉ là lưới an toàn.

## Làm theo thứ tự, đừng sinh song song

Ba ảnh này sẽ là chuẩn cho mọi ảnh về sau. Nếu chúng **lệch nhau**, mọi ảnh
tương lai thừa kế luôn chỗ lệch đó — và lúc ấy không còn gì để đối chiếu nữa.

Nên sinh nối tiếp, không sinh song song:

1. **Ảnh đôi trước.** Đính `anh-goc.webp`. Duyệt kỹ bằng
   [`to-mau-ty-le.svg`](to-mau-ty-le.svg) và danh sách bảy thứ trong hợp đồng.
   Chưa đạt thì sinh lại, **chưa được đi tiếp**.
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

## Bước 1 — `tham-chieu-doi.png`

**Đính kèm:** `anh-goc.webp` + `LINH-VAT.md`. Không đính `to-mau-ty-le.svg`.

```
FILE ROLES — read this first. You have been given several files. They do NOT
have equal authority.

- anh-goc.webp — the only existing picture of these two characters. Use it for
  exactly one thing: WHO THEY ARE and what the drawing language is — flat
  colour, black ink outline, the brain's lavender body, the heart's coral body,
  round glasses, mint headphones. It is NOT a quality standard, NOT a layout to
  copy, and NOT a style reference that overrides this text. It is a
  known-defective specimen. Its defects are listed immediately below.
- LINH-VAT.md — the written contract, for background. Where it and this message
  disagree, THIS MESSAGE WINS. Ignore its "GIVE ME 3-5 VERSIONS" block.
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
height as 10 units: the heart's body is 8.8 tall, but BOTH characters have the
same eyes — 2.6 across, centres 4.2 apart, centred at 58% of body height
measured from the bottom. The outline is 0.45 thick on both. A heart with
smaller eyes than the brain is a failed drawing.

THE GLASSES AND THE HEADPHONES are built, not stuck on. The glasses' rims are
exactly as thick as the body outline, never thicker. Each lens is 3.6 across —
clearly wider than the 2.6 eye inside it — so a ring of white shows between
pupil and rim. If rim and pupil merge into one black mass, the lens is too
small; enlarge it.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight black ink outline drawn with a confident hand
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
coloured outline, variable line weight, sparkles, glow, halo, vignette, texture
overlay, stiff symmetrical stock pose, subject floating with no ground contact,
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

Re-measure before you finish: the heart's body is 8.8 tall where the brain's is
10, but their eyes are the same size. Each glasses lens is clearly wider than
the eye inside it.
```

**Duyệt xong mới đi tiếp.** Soi bằng [`to-mau-ty-le.svg`](to-mau-ty-le.svg) và
danh sách bảy thứ ở cuối [`LINH-VAT.md`](LINH-VAT.md).

---

## Bước 2 — `tham-chieu-nao.png`

**Đính kèm:** `tham-chieu-doi.png` vừa duyệt + `LINH-VAT.md`.
**Gỡ `anh-goc.webp` ra.** Nó đã hết việc.

```
FILE ROLES — read this first.

- tham-chieu-doi.png — THIS is the style reference, and it is authoritative.
  Match its art style, line weight, colour, eye size and proportions exactly.
  Where it and this text disagree about how something LOOKS, the image wins.
  You are redrawing the same character that appears in it, alone — not
  designing a new one.
- LINH-VAT.md — the written contract, for background. Where it and this message
  disagree, THIS MESSAGE WINS. Ignore its "GIVE ME 3-5 VERSIONS" block.
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
bottom. Outline 0.45 thick. Arms 5.5 long, attached at 55% of body height from
the bottom. Legs 3.8 long.

THE GLASSES are built, not stuck on. The rims are exactly as thick as the body
outline, never thicker. Each lens is 3.6 across — clearly wider than the 2.6
eye inside it — so a ring of white shows between pupil and rim. If rim and
pupil merge into one black mass, the lens is too small; enlarge it.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight black ink outline drawn with a confident hand
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

KEEP: brain #9097DE · ink #0B0B12 · paper #F5F4E9 · flat ellipse shadow
#E0D8C8.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, 3D, texture, blush cheeks,
coloured outline, variable line weight, sparkles, glow, halo, vignette, texture
overlay, stiff symmetrical stock pose, subject floating with no ground contact,
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

**Đính kèm:** `tham-chieu-doi.png` vừa duyệt + `LINH-VAT.md`.
**Gỡ `anh-goc.webp` ra.**

```
FILE ROLES — read this first.

- tham-chieu-doi.png — THIS is the style reference, and it is authoritative.
  Match its art style, line weight, colour, eye size and proportions exactly.
  Where it and this text disagree about how something LOOKS, the image wins.
  You are redrawing the same character that appears in it, alone — not
  designing a new one.
- LINH-VAT.md — the written contract, for background. Where it and this message
  disagree, THIS MESSAGE WINS. Ignore its "GIVE ME 3-5 VERSIONS" block.
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
image. In tham-chieu-doi.png the heart's body is 8.8 units tall where the
brain's is 10 — but their eyes are IDENTICAL: 2.6 across, centres 4.2 apart,
centred at 58% of body height from the bottom, outline 0.45 thick. Keep the
eyes at exactly that size. Arms 5.5 long, attached at 55% of body height from
the bottom. Legs 3.8 long.

THE HEADPHONES are built, not stuck on. Mint green, each ear cup 2.8 across,
the connecting band 0.5 thick.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, an even-weight black ink outline drawn with a confident hand
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

KEEP: heart #D46B76 · mint #9BE5C5 · ink #0B0B12 · paper #F5F4E9 · flat
ellipse shadow #E0D8C8.

NEVER: human figure, person, humanoid body, mascot costume, shoulders, chest,
waist, hips, neck, gradient, shading, soft shadow, 3D, texture, blush cheeks,
coloured outline, variable line weight, sparkles, glow, halo, vignette, texture
overlay, stiff symmetrical stock pose, subject floating with no ground contact,
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

Soi theo danh sách bảy thứ ở cuối [`LINH-VAT.md`](LINH-VAT.md), mở
[`to-mau-ty-le.svg`](to-mau-ty-le.svg) cạnh bên để đo.

Hai lỗi dễ bỏ sót nhất, vì mắt thường không bắt được:

- **Mắt Tim co theo thân.** Đặt ảnh Não và ảnh Tim cạnh nhau, so hai cặp mắt.
  Lệch cỡ là trượt, không cần đo tiếp.
- **Kính bít mắt.** Phóng to chỗ mắt Não. Phải thấy một vành trắng giữa con
  ngươi và gọng. Dính thành khối đen là tròng quá nhỏ.

Và một phép thử rẻ bắt được gần hết mọi lỗi còn lại: **thu nhỏ ảnh còn 32px.**
Chi tiết thừa ở cỡ lớn trông vô hại, ở cỡ nhỏ thành vệt bẩn.

Đạt rồi thì:

1. Lưu đúng ba tên: `tham-chieu-doi.png`, `tham-chieu-nao.png`, `tham-chieu-tim.png`
2. Xoá `anh-goc.webp`
3. Xoá file này
4. Gỡ ghi chú "Tình trạng hôm nay" ở đầu [`LINH-VAT.md`](LINH-VAT.md)
