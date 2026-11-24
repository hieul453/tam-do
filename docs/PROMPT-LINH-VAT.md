# Prompt đặt hàng tài nguyên linh vật

> **Cách dùng.** Chép toàn bộ phần giữa hai vạch ngang bên dưới, dán vào AI
> khác, **và đính kèm ảnh gốc đã chốt** (bản sheet 1024×1024 có 14 tư thế). Ảnh
> là bắt buộc — thiếu nó thì mọi con số trong prompt đều vô nghĩa.
>
> Prompt này viết cho **AI trợ lý** (loại nhận ảnh, trả về tài liệu và file).
> Riêng mục 7 bên trong là prompt dành cho **AI sinh ảnh**, tiếng Anh, chép
> riêng khi cần vẽ thêm tư thế mới.
>
> Phần nền tảng và lý do đằng sau từng yêu cầu: [LINH-VAT.md](LINH-VAT.md).

---

## Bối cảnh

Tôi đang làm một app học tâm lý học cho sinh viên ngành tâm lý. App có hai linh
vật đã chốt, **không vẽ lại, không đổi thiết kế**:

- **Não** — màu tím oải hương, đeo kính tròn. Đại diện cho **lý trí**.
- **Tim** — màu đỏ san hô, đội tai nghe xanh bạc hà. Đại diện cho **cảm xúc**.

Ảnh đính kèm là **bản chốt duy nhất**. Mọi thứ bạn làm phải đối chiếu được về
đúng ảnh đó.

Phong cách: **truyện tranh web Việt Nam** (kiểu Én Comics), kết hợp **tối giản**.
Nét mực đen đều một độ dày, màu bệt tuyệt đối, hình đơn giản, không chi tiết thừa.

## 1. Tám yêu cầu của tôi

1. Giữ đúng concept trong ảnh đính kèm, giữ chất Én Comics và tinh thần tối giản.
2. Chuyển sang AI nào làm tiếp thì hai linh vật vẫn **phải giống hệt nhau**, không
   được ra style khác.
3. Ngoài dùng trong app, tôi muốn mở rộng sang **animation, truyện tranh, video,
   short**. Hãy chừa cửa cho việc đó.
4. App hiện chạy **web có responsive**, sau này mở sang **Android và iOS**. Tài
   nguyên phải phục vụ được cả hiện tại lẫn tương lai.
5. Hai linh vật phải dùng được **đơn lẻ** hoặc **tương tác với nhau**, tuỳ ngữ cảnh.
6. Mỗi linh vật có **bộ phụ kiện riêng**, nhưng phụ kiện phải bám đúng bản chất:
   Não là lý trí, Tim là cảm xúc.
7. Tài nguyên phải **tùy biến cao như khái niệm trong lập trình**: đổi phụ kiện
   chéo giữa hai nhân vật, dùng lại một động tác cho cả hai, mở rộng không phải
   vẽ lại từ đầu.
8. Sau này tôi muốn dùng hai linh vật để làm các hoạt hoạ vui trong app, tăng
   tính giải trí và tương tác.

**Yêu cầu thứ chín, quan trọng không kém:** hoạ sĩ thật nhận tài nguyên về phải
dùng được ngay bằng công cụ phổ thông. Không định dạng tự chế, không bắt ai cài
công cụ lạ.

## 2. DNA phải giữ — đây là phần không được đụng vào

| Hạng mục | Luật |
|---|---|
| Khối dựng hình | Não = khối nhiều bướu tròn; Tim = khối tim hai thuỳ. **Đầu chính là thân** — không cổ, không mình riêng. |
| Nét | **Một độ dày duy nhất** trên toàn hình, mực đen, viền kín. Không nét mảnh dần, không nét nhiều màu. |
| Màu | **Bệt tuyệt đối.** Không gradient, không đổ bóng mềm, không highlight. |
| Tay chân | **Rubber hose**: que đen mảnh, không khớp, không cơ bắp. Bàn tay là ba gạch ngắn. Bàn chân là một gạch ngang. |
| Mắt | Lòng trắng to hình bầu dục đứng, con ngươi đen đặc. **Không có chấm sáng.** |
| Nền và bóng | Nền giấy kem. Bóng đổ là một ê-líp bệt dưới chân, không mờ viền. |

**Tuyệt đối không có:** má hồng, chấm sáng trong mắt, vân nền, viền ngoài màu
khác đen, đổ bóng mềm, hiệu ứng 3D, chuyển sắc, răng chi tiết, ngón tay có đốt.

## 3. Bảng màu — đo từ chính ảnh gốc

Các mã dưới đây lấy bằng cách dựng biểu đồ tần suất màu trên ảnh gốc và lấy giá
trị xuất hiện nhiều nhất, **không phải ước lượng bằng mắt**. Sai số chấp nhận
được: ±3 trên mỗi kênh.

| Vai trò | Mã |
|---|---|
| Thân Não | `#9097DE` |
| Thân Tim | `#D46B76` |
| Xanh bạc hà (tai nghe) | `#9BE5C5` |
| Nét viền | `#0B0B12` — gần như đen, hơi ngả xanh |
| Lòng trắng mắt | `#FCFCFC` |
| Nền giấy | `#F5F4E9` |
| Bóng đổ | `#E0D8C8` |
| Vàng bóng đèn (emote) | `#FCF494` |
| Xanh giọt mồ hôi (emote) | `#BCD8E4` |

Không gian màu **sRGB**.

## 4. Tỉ lệ — đo từ chính ảnh gốc

Đơn vị: **chiều rộng thân Não = 100**. Mọi số khác quy về đơn vị này.

| Phép đo | Giá trị |
|---|---|
| Thân Não | rộng **100**, cao **75** |
| Thân Tim | rộng **72**, cao **73** |
| Lòng trắng mắt | rộng **16**, cao **19** |
| Khoảng cách giữa hai tâm mắt | **32** |
| Tròng kính của Não | đường kính **29**, tâm trùng tâm mắt, hai tròng gần chạm nhau |
| Chụp tai nghe của Tim | rộng **12**, nằm **ngay sát ngoài** đường viền thân |
| Tâm mắt của Não | đúng **50%** chiều cao thân, tính từ đỉnh |
| Tâm mắt của Tim | **42%** chiều cao thân, tính từ đỉnh |
| Miệng của Tim | **79%** chiều cao thân, tính từ đỉnh |
| Miệng của Não | ngay dưới mép dưới tròng kính |

> **Phát hiện quan trọng, phải giữ:** kích thước mắt và khoảng cách hai mắt của
> Não và Tim **bằng nhau tính theo pixel tuyệt đối**. Tức là cùng một khuôn mặt
> đặt lên hai thân khác hình. Đây là lý do hai nhân vật trông cùng một nhà, và
> cũng là lý do đổi phụ kiện chéo được. **Không được chỉnh mặt theo tỉ lệ thân.**

Các số chưa đo được, đừng tự bịa — hỏi tôi: chiều dài tay chân, vị trí khớp vai
và khớp hông, tỉ lệ con ngươi so với lòng trắng.

## 5. Tài nguyên phải giao, theo đúng thứ tự

Làm xong bước trước mới sang bước sau. Nếu bước nào bạn không làm được, **nói
thẳng là không làm được**, đừng giao bản gần đúng rồi gọi là xong.

| # | Tài nguyên | Nội dung |
|---|---|---|
| 1 | **Character bible** | Style guide, bảng tỉ lệ, bảng màu, và **off-model sheet** — vẽ vài bản sai kèm chú thích sai chỗ nào |
| 2 | **Turnaround** | Chính diện / ba-phần-tư / nghiêng / sau, cho cả hai nhân vật |
| 3 | **Vector master** | Vẽ lại hai nhân vật thành vector **còn nguyên lớp**, từ ảnh gốc |
| 4 | **Prop sheet** | Từng phụ kiện một file rời, cùng góc, cùng tỉ lệ, **có đánh dấu điểm gắn** |
| 5 | **Expression sheet** | Tối thiểu: thường, vui, nghĩ, ngạc nhiên, buồn, nháy mắt |
| 6 | **Pose sheet** | Tối thiểu: đứng, vẫy tay, nhảy, chạy, suy tư, dang tay |
| 7 | **Two-shot sheet** | Hai nhân vật tương tác: đứng cạnh nhau, đập tay, an ủi, tranh luận |
| 8 | **Emanata library** | Ký hiệu truyện tranh: giọt mồ hôi, vạch tốc độ, dấu chấm than, tim bay, bóng đèn, dấu hỏi |
| 9 | **Rig** | Bộ xương có slot, kèm thư viện động tác tái dùng |

## 6. Quy ước bắt buộc

### 6.1 Tên điểm gắn phải giống hệt nhau giữa hai nhân vật

Đây là điều kiện để đổi phụ kiện chéo và để dùng chung động tác. Hai nhân vật
phải khai báo **cùng một bộ tên slot**, không thiếu cái nào:

```
slot-mat-trai     slot-mat-phai     slot-mieng
slot-tai-trai     slot-tai-phai     slot-dinh-dau
slot-vai-trai     slot-vai-phai
slot-hong-trai    slot-hong-phai
```

Kính của Não cắm vào `slot-mat-*`; tai nghe của Tim cắm vào `slot-tai-*`. Vì tên
slot giống nhau, **Não đội được tai nghe và Tim đeo được kính** — đó là tính
năng, không phải lỗi.

### 6.2 Phụ kiện phải nói đúng bản chất nhân vật

| | Là dụng cụ của… | Ví dụ |
|---|---|---|
| **Não** | lý trí, đo đạc, ghi chép | kính, bút chì, kính lúp, sổ tay, thước |
| **Tim** | cảm xúc, chăm sóc, kết nối | tai nghe, khăn quàng, băng dán, ly ấm, trái tim nhỏ |

Đừng thêm phụ kiện chỉ vì nó dễ thương. Mỗi món phải trả lời được câu "món này
nói lên điều gì về nhân vật".

### 6.3 Định dạng bàn giao — chỉ dùng thứ phổ thông

| Loại | Giao bằng | Mở được bằng |
|---|---|---|
| Vector master | **SVG** (chính) + **PDF** hoặc **AI** | Illustrator, Figma, Affinity, Inkscape |
| File thiết kế | **`.fig`** | Figma, Penpot |
| Hoạt hoạ | **`.riv`** hoặc **Lottie `.json`**, kèm file nguồn | Rive, After Effects |
| Raster | **PNG** nền trong, @1x/@2x/@3x | tất cả |
| Bảng màu | **`.ase`** + bảng hex | Illustrator, Photoshop, Figma, Affinity |

Không bịa định dạng riêng. Không nhét dữ liệu vào JSON tự chế.

**Giao cả bản sửa được, không chỉ bản xuất.** SVG phải còn nguyên nhóm và lớp,
**đường nét vẫn là stroke chứ chưa expand**, không mask thừa, không clip-path
thừa. Gửi SVG đã bẹt hết là gửi một bức ảnh.

### 6.4 Tên lớp — tiếng Anh không dấu, theo cây này

```
nao/
  body
  folds
  face/   eye-left · eye-right · mouth
  limbs/  arm-left · arm-right · leg-left · leg-right
  slots/  slot-mat-trai · slot-tai-trai · …
props/
  glasses · headphones · pencil · scarf · …
```

### 6.5 Hệ co giãn cho responsive

Quy định sẵn **bậc rút gọn chi tiết**: cỡ nào bỏ phụ kiện, cỡ nào bỏ tay chân,
cỡ nhỏ nhất còn lại gì. Kèm **kích thước tối thiểu** và **khoảng trống quanh**.

### 6.6 Hoạt hoạ

Mỗi động tác phải có **bản rút gọn cho `prefers-reduced-motion`** — một trạng
thái tĩnh thay thế. Đây là yêu cầu tiếp cận, không phải tuỳ chọn.

## 7. Prompt cho AI sinh ảnh

Khi cần vẽ thêm tư thế mới bằng AI sinh ảnh: **luôn đính kèm ảnh gốc làm
reference**, bật tính năng *character reference* / *style reference* nếu công cụ
có, và mỗi lần chỉ sinh **một nhân vật, một góc nhìn**.

Prompt dương:

```
Flat vector cartoon mascot, clean webcomic style. [BRAIN: a lavender-purple
brain character wearing round black-rimmed glasses | HEART: a coral-red heart
character wearing mint-green headphones]. Thick uniform solid black outline of
a single constant weight. Completely flat fill, no gradient, no shading, no
highlight. Large white vertical-oval eyes with solid black pupils and no catch
light. Small simple smile. Thin black rubber-hose stick arms and legs with no
joints; three short strokes for fingers; a single short stroke for each foot.
No neck and no separate torso — the head IS the body. Cream paper background,
flat hard-edged oval drop shadow. Front view, centred, full body.
Exact colours: brain #9097DE, heart #D46B76, mint #9BE5C5, outline #0B0B12,
eye white #FCFCFC, paper #F5F4E9, shadow #E0D8C8.
```

Prompt âm:

```
gradient, shading, soft shadow, blur, 3D, texture, grain, noise, blush cheeks,
eye highlight, catch light, coloured outline, variable line weight, painterly
brush, realistic anatomy, jointed fingers, knuckles, neck, separate torso,
extra characters, text, watermark, signature, border, frame
```

## 8. Nghiệm thu — đo, không chấm bằng mắt

Mỗi ảnh hoặc file giao ra phải qua đủ bảy mục này. Mục nào trượt thì làm lại,
không thương lượng.

1. **Nét**: lấy mẫu năm điểm trên đường viền — phải cùng một độ dày, và màu
   nằm trong khoảng `#0B0B12` ±8 mỗi kênh.
2. **Màu bệt**: trong vùng thân, **≥ 90%** pixel phải nằm trong ±6 mỗi kênh so
   với mã đã cho. Nhiều hơn một dải màu nghĩa là có gradient — trượt.
3. **Mắt**: chiều rộng lòng trắng ÷ chiều rộng thân Não = **0.16 ± 0.02**.
4. **Khoảng cách mắt**: ÷ chiều rộng thân Não = **0.32 ± 0.03**.
5. **Tỉ lệ hai nhân vật**: rộng Tim ÷ rộng Não = **0.72 ± 0.04**.
6. **Tay chân**: là nét đơn, không có viền trong viền, không có khớp.
7. **Danh sách cấm**: không má hồng, không chấm sáng mắt, không bóng mềm, không
   chữ, không watermark.

## 9. Cách làm việc tôi mong đợi

- **Thiếu thông tin thì hỏi, đừng suy đoán rồi làm theo suy đoán.** Mục 4 đã ghi
  rõ những số nào chưa có.
- **Không bịa số liệu, không bịa tên nghiên cứu hay nguồn.** Thiếu nguồn thì ghi
  là thiếu.
- Làm được tới đâu nói tới đó. Bước nào vượt khả năng của bạn thì nói ngay từ
  đầu, để tôi tìm người khác làm bước đó.
- Giao kèm một file `README` ghi: không gian màu, mã màu, khung vẽ, độ dày nét
  gốc, cỡ nhỏ nhất cho phép.

---

**Hết prompt.**
