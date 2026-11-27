# Hệ style

> Chốt ngày 26/11/2026. Đối chiếu về [CONCEPT.md](CONCEPT.md) và
> [linh-vat/LINH-VAT.md](linh-vat/LINH-VAT.md).
>
> Mỗi quyết định ở đây ghi kèm **phép đo** và **điều kiện mở lại**. Con số nào
> không kiểm lại được thì không nên có trong file này.
>
> Kiểm toàn bộ màu: `node scripts/do-mau.mjs`

## Đang ở đâu

| Trục | Trạng thái |
|---|---|
| 01 · Nền và chữ | **chốt** |
| 02 · Màu ngữ nghĩa | **chốt** |
| 03 · Font | **chốt** |
| 04 · Nhịp chữ | **chốt** |
| 05 · Hình khối | **chốt** |
| 06 · Biểu tượng | mở khoá, chưa chốt |
| 07 · Art style nội dung | mở khoá, chưa chốt |
| 08 · Chuyển động | chờ có cái để động |

Token sống ở block `@theme` trong [`src/styles/index.css`](../src/styles/index.css).
File này giải thích **vì sao**; file kia là nguồn sự thật về **giá trị**.

---

## 01 · Nền trắng

`--color-nen: #ffffff` · `--color-chu: #18181b` · `--color-chu-phu: #52525b`

Đã cân nhắc nền kem `#F5F4E9` — màu giấy của linh vật — và **bỏ**.

Lý do hay được dùng nhất để chọn kem là "đỡ mỏi mắt", nhưng đo ra thì kem chỉ
tối hơn trắng **10%** (độ sáng 0.900 so với 1.000). Dưới ngưỡng làm được gì;
câu trả lời thật cho ban đêm là chế độ tối. Và kem có giá phải trả mãi mãi:

- Nền kem ngả vàng **12 mức** (R245 G244 B233), nên **mọi màu trung tính phải
  hâm ấm bằng tay** — đường kẻ, chữ mờ, trạng thái khoá, lưới biểu đồ. Một màu
  xám trung tính đặt lên nó đọc ra hơi xanh.
- Mọi ảnh nền trắng dán vào nội dung đều nổi lên thành ô sáng.
- Chế độ tối phải tự quyết lại từ đầu. Trắng → tối là ánh xạ ai cũng biết;
  kem → tối thì chưa ai giải sẵn.

> **Điều kiện mở lại:** quyết định này treo vào việc **tài sản linh vật giao
> cho app đã tách nền**. Nếu chuyển sang giao ảnh nguyên nền kem, hoặc bỏ linh
> vật, thì mở lại — lúc đó cái giá đảo chiều, vì mỗi ảnh lại phải xoá hoặc vẽ
> lại bóng.
>
> **Trạng thái của điều kiện này:** hợp đồng linh vật vẫn giữ luật *"ảnh tham
> chiếu không tách nền, tài sản giao cho app thì phải tách"*. Bước tách **chưa
> có script**, nhưng giờ rẻ: `scripts/don-anh-linh-vat.mjs` đã ép nền về đúng
> một màu `#F5F4E9` duy nhất, nên khoá màu đó ra là xong. Ngày nào thấy bước
> tách quá đắt mà bỏ, thì quay lại đọc mục này trước khi đổi nền app.

Mức nhạt nhất mà chữ phụ còn đạt 4.5:1: `#76767C` trên trắng, `#717179` khi
nằm trong khối có tô. Token hiện tại `#52525b` đậm hơn thế nhiều, còn dư chỗ.

---

## 02 · Màu linh vật chỉ làm nền tô

Đây không phải lựa chọn thẩm mỹ. Cả ba màu linh vật **trượt** khi làm màu chữ
trên nền trắng:

| | làm màu chữ trên trắng | mực đè lên nó |
|---|---|---|
| tím Não `#9097DE` | 2.74:1 — trượt | 7.16:1 — đạt |
| đỏ Tim `#D46B76` | 3.41:1 — trượt | 5.76:1 — đạt |
| bạc hà `#9BE5C5` | 1.46:1 — trượt nặng | 13.45:1 — đạt |

Nên luật một câu: **màu linh vật là màu tô, không bao giờ là màu chữ.**

`scripts/do-mau.mjs` kiểm cả chiều ngược lại — nếu một ngày ba màu này bỗng
đạt 4.5:1, nghĩa là ai đó đã đổi chúng, và luật trên mất lý do tồn tại.

Màu ngữ nghĩa là **bộ riêng**, sẫm hơn, đều đạt trên trắng:

| | | |
|---|---|---|
| `--color-dung` | `#15803d` | 5.02:1 |
| `--color-sai` | `#b91c1c` | 6.47:1 |
| `--color-han-lam` | `#4338ca` | 7.90:1 |

Màu viền thân linh vật (`#5f66ac` · `#8f404a`) lấy từ hợp đồng linh vật, dùng
khi vẽ lại linh vật bằng SVG hoặc khi cần một chấm nhận diện đậm.

---

## 03 · Font: Be Vietnam Pro, một họ, hai sức nặng

Đo bằng canvas ở 100px — chiều cao **thật của mực**, không phải chiều cao font
khai báo:

| font | cao chữ hoa | cao chữ x | **cao dấu** | giãn dòng tối thiểu | bề ngang câu |
|---|---|---|---|---|---|
| **Be Vietnam Pro** | 0.76 | 0.53 | **1.15** | **1.50** | 20.64 |
| Inter | 0.76 | 0.55 | 1.09 | 1.44 | 20.48 |
| Lexend | 0.77 | 0.53 | 1.05 | 1.40 | 20.83 |
| Nunito | 0.72 | 0.50 | 1.03 | 1.34 | 19.21 |
| Source Sans 3 | 0.70 | 0.49 | 0.95 | 1.30 | 17.86 |

*(Câu đo: "Tâm lý học nghiên cứu điều gì ở mỗi người?" — chuỗi dấu chồng:
"Ẫ Ỗ Ữ ể ộ ỹ" — chuỗi sâu nhất: "ụgy")*

**Chỗ lật ngược giả định:** font được thiết kế *riêng cho tiếng Việt* lại có
dấu **cao nhất bảng** — đội lên 51% so với chữ hoa, trong khi các font khác chỉ
36–43%. Đó không phải lỗi. Người vẽ tiếng Việt trước tiên thì vẽ dấu **rộng rãi
và rõ** thay vì nén cho vừa khung Latin.

Cái giá đo được rất nhỏ: giãn dòng 1.50 thay vì 1.44 của Inter — đoạn văn cao
thêm **4%**. Bề ngang gần như bằng Inter (20.64 so với 20.48) nên không mất chỗ
trên màn 375px. Chữ x thấp hơn Inter 0.02, ở cỡ 11px là 0.2 pixel.

Source Sans 3 hẹp hơn 13.5%, nghe hấp dẫn cho mobile, nhưng trả bằng chữ x thấp
nhất bảng (0.49) — đúng chỗ cần đọc được nhất thì nó yếu nhất.

### Chỉ tải hai sức nặng, và tải cho đúng

**Be Vietnam Pro không có bản biến thiên trên Google Fonts.** Xin một dải thì
API trả về **HTTP 400 "Font family not found"**, và trình duyệt lặng lẽ rơi về
`system-ui` — không báo lỗi, không ai nhận ra cho tới lúc nhìn kỹ.

Khung dựng sẵn của repo từng mắc đúng lỗi này. Link đúng:

```
https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap
```

Đo được: subset tiếng Việt nặng **11.3 KB** (400) + **11.9 KB** (600) =
**23.2 KB**. Không tải chữ nghiêng — thiết kế không dùng.

Thêm sức nặng thứ ba thì đo lại xem có đáng 12 KB không.

---

## 04 · Nhịp chữ

| Vai trò | Cỡ | Đậm | Giãn dòng |
|---|---|---|---|
| Nhãn khối | 11px | 600 | 1.4 |
| Chú thích · meta | 13px | 400 | 1.5 |
| Chữ thường | 16px | 400 | 1.6 |
| Tiêu đề khối | 18px | 600 | 1.4 |
| Tiêu đề bài | 22px | 600 | 1.4 |

Nhãn khối viết hoa, giãn chữ `0.09em`. Dòng chữ thường tối đa khoảng **560px**.

> **Luật cứng:** mọi thứ có thể xuống dòng đều phải giãn dòng **≥1.4**. Ở Be
> Vietnam Pro hai dòng chạm nhau từ **1.38** — tiêu đề hai dòng để 1.2 hay 1.3
> theo thói quen thiết kế tiếng Anh thì dấu dòng dưới đâm vào chữ dòng trên.
> Đã đặt sẵn cho `h1`–`h4` trong `index.css`.

---

## 05 · Hình khối: tô nền theo loại, không viền

Bỏ nền kem thì mất luôn cách phân tầng — vùng nội dung không còn tự tách khỏi
vỏ app bằng việc đổi nền. Việc đó chuyển xuống cho khối nội dung gánh, và sắc
tô được giao thêm một việc: **nói trước đây là loại khối gì**.

Đã cân nhắc và bỏ hai phương án khác:

- **Viền một pixel** — rẻ nhất, nhưng bài dài thành một xâu hộp giống hệt nhau;
  mắt không bám được chỗ nào.
- **Không có hộp**, chỉ khoảng trống và đường kẻ — đọc dài dễ chịu nhất, nhưng
  làm mờ ranh giới khối, mà khối là đơn vị của cả mô hình nội dung. Và nó trượt
  gần ranh giới *"một cuốn sách điện tử"* nhất.

Bo góc 12px, đệm trong 12px, **không viền**.

### Bốn loại khối

Sắc tô nói đúng một thứ: **người đọc đang được yêu cầu làm gì.** Nên chia theo
hành động, không theo chủ đề.

| Loại | Nền | Là gì |
|---|---|---|
| **Làm thử** | `#f6f7fc` · tím Não 8% | Tự tay làm, kết quả là của mình. Thí nghiệm tự thân, kéo tham số, chạm tự do, đoán trước khi lộ |
| **Đọc** | *không tô* | Không có hành động nào. Giải thích, ví dụ, tầng hàn lâm |
| **Tự kiểm** | `#edfaf5` · bạc hà 18% | Xem có đọng lại không. Phân loại, nhớ lại, nối cặp. **Không chấm điểm, không xếp hạng** |
| **Ghi lại** | `#fcf5f6` · đỏ Tim 6% | Mang ra khỏi app, vào đời sống. Nhật ký thực hành — dữ liệu riêng tư, xem luật 6 |

**Tỉ lệ pha lệch nhau là có chủ ý.** Pha cùng tỉ lệ thì ba màu ra ba sức nặng
rất khác: bạc hà nhạt sẵn nên ở 9% gần như chìm, đỏ ở 9% đã hơi ồn. Chỉnh lại
thành 8 · 18 · 6 thì cả ba nổi bằng nhau quanh **1.07** trên trắng.
`scripts/do-mau.mjs` canh chỗ này, lệch quá 12% là báo.

**"Đọc" không có màu, và đó là chủ ý.** Vắng màu chính là tín hiệu — khối nào
không tô thì không đòi bạn làm gì. Nhờ vậy bảng màu đứng yên ở đúng ba sắc,
bằng số màu linh vật đang có.

**Hai màu mang đúng nghĩa của nhân vật.** Não cho việc làm thử và suy luận, Tim
cho việc mang vào đời sống. Không phải tô cho đẹp — đó là nghĩa sẵn có của hai
nhân vật, kéo vào giao diện.

### Hệ quả vượt ra ngoài chuyện màu

Bốn loại này là **enum trên cùng của mô hình nội dung**. CONCEPT mục 6 ghi nội
dung là dữ liệu trỏ tới một sổ đăng ký component tương tác; bốn loại ở đây là
tầng gom phía trên sổ đó.

Chúng cũng là chỗ tự nhiên để phát sự kiện cho tầng gamification ở mục 7 —
*"làm thử xong"*, *"tự kiểm xong"*, *"đã ghi lại"* — nên ba trong bốn hành vi
được thưởng đã có sẵn nguồn phát, không phải gắn thêm.

> **Thêm một kiểu tương tác mới thì thêm vào sổ đăng ký, KHÔNG đẻ thêm màu.**
> Bảng màu đứng yên ở bốn loại. Đây là luật "thêm một thứ chỉ chạm một chỗ"
> áp vào màu sắc.

---

## Chưa chốt

Ba ảnh tham chiếu linh vật **đã có** từ 26/11/2026, nên hai trục dưới đây hết
bị chặn. Chưa chốt, nhưng làm được rồi.

**06 · Biểu tượng** — bộ icon phải mang được nét của linh vật: viền đều một
độ dày, nét khép kín, không chuyển sắc. Một điều đã chắc: **không dùng emoji**.
Mỗi máy vẽ một kiểu, không đổi màu được, không mang được nét vẽ nào.

**07 · Art style nội dung** — CONCEPT mục 4: linh vật **không sống ở vỏ app**,
chúng ở trong nội dung và lúc chuyển cảnh.

Hai khuyết điểm đã biết của ba ảnh chuẩn, cần tính tới khi làm hai trục này:
**không có bàn chân** (bốn vòng prompt không ép được, muốn đúng thì sửa tay),
và **viền thân Tim còn lẫn mực** — đo được 70–79% ám màu, trong khi viền Não
đạt 93–94%. Xem ghi chú đầu [LINH-VAT.md](linh-vat/LINH-VAT.md).

**08 · Chuyển động** — chờ có cái để động. Luật 7 đã xử lý ở `index.css`;
hoạt ảnh viết bằng JavaScript thì phải tự gọi `matchMedia`.

**Chế độ tối** — chưa bàn. Mọi token hiện tại là bản sáng.

---

## Khi đổi token

1. Sửa trong `src/styles/index.css`, block `@theme`.
2. Sửa bảng `MAU` trong `scripts/do-mau.mjs` cho khớp.
3. Chạy `node scripts/do-mau.mjs`. Trượt thì nó thoát với mã 1.
4. Nếu đổi thứ có ghi "điều kiện mở lại" ở trên, ghi lại lý do vào đây.
