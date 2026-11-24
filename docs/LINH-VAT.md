# Linh vật Não và Tim — hợp đồng phong cách

> **Mỗi lần nhờ AI sinh ảnh:** đính kèm `docs/linh-vat/anh-goc.webp`, chép khối
> prompt bên dưới, điền dòng `REQUEST` cuối cùng.
>
> Ảnh đính kèm là thứ giữ phong cách, không phải chữ. Thiếu ảnh thì prompt này
> chỉ còn một nửa tác dụng.

## Prompt — chép nguyên văn

```
The attached image is the style reference. Match its art style, line, colour
and proportions. It overrides anything you infer from this text.

TWO MASCOTS, from a Vietnamese psychology-learning app:
- BRAIN — lavender purple, round black-rimmed glasses. Reason, logic, the one
  who overthinks.
- HEART — coral red, mint-green headphones. Emotion, impulse, warmth.
The head IS the body: no neck, no torso. Thin rubber-hose limbs, no joints.

STYLE DNA — Vietnamese webcomic, in the lineage of Én Comics and Thỏ Bảy Màu:
flat colour, one constant-weight black ink outline, no gradient and no
shading, minimal detail. And genuinely funny — minimalism in the drawing,
personality in the acting. Cute alone is not the target; the joke is.

TELL IT THROUGH ACTION. The pose, the face and the body language carry the
whole meaning. No speech bubbles, no captions, no written words anywhere in
the image. If the viewer has to read something to get it, the pose is wrong —
redraw the pose.

You may borrow gags, poses and visual clichés from pop culture, Vietnamese or
international, whenever they land better than a literal illustration.

KEEP: brain #9097DE · heart #D46B76 · mint #9BE5C5 · ink #0B0B12 ·
paper #F5F4E9 · flat ellipse shadow #E0D8C8. Both characters share the SAME
face size — the heart's body is smaller, its eyes are not.

NEVER: gradient, shading, soft shadow, 3D, texture, blush cheeks, eye catch
light, coloured outline, variable line weight, neck, jointed fingers, text,
watermark, frame.

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

## Nhận ảnh về thì soi ba thứ

1. **Màu bệt và nét đều** — thấy chuyển sắc, bóng mềm hay nét lúc dày lúc mỏng
   là trượt.
2. **Mặt hai nhân vật cùng cỡ** — AI rất hay co mặt Tim theo thân nhỏ hơn. Mất
   cái này là hai nhân vật trông như hai nhà khác nhau.
3. **Không có chữ trong ảnh** — kể cả chữ nhỏ trong bong bóng thoại.

Ảnh đạt thì bỏ vào `docs/linh-vat/da-duyet/`, đặt tên
`<nhan-vat>-<trang-thai>-<ngay>.png`. Lần sau đính kèm cả ảnh gốc lẫn ảnh gần
nhất — bộ tham chiếu càng dày thì càng ít trôi. Đây là cách giữ đồng nhất hiệu
quả nhất sau chính ảnh gốc.

## Hướng đang theo, và cái giá của nó

**25/11/2026 — ảnh raster, cần gì sinh lúc đó.** Không dựng vector, không dựng
rig, không dựng thư viện thành phần.

Đổi lại: mỗi lần sinh là một lần rút thăm, không đổi phụ kiện bằng tham số,
không tái dùng động tác, PNG không phóng to được, và chưa có đường ra animation
thật. Ảnh gốc 1024×1024 chứa 14 tư thế nên mỗi nhân vật chỉ khoảng 210 pixel —
đủ cho web, không đủ cho in hay video.

Lúc nào phải sinh đi sinh lại quá nhiều cho cùng một thứ, hoặc cần in, dựng
video, làm animation thật — đó là lúc nên quay lại dựng vector. Bản phân tích
hướng thiết kế đã bỏ vẫn nằm trong lịch sử git, ở commit `dc9c43b` trở về trước.

## Thư mục

```
docs/linh-vat/
  anh-goc.webp     ← bản chốt, đính kèm mỗi lần, không sửa
  da-duyet/        ← ảnh đã soi xong
```
