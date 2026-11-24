# Core concept

> Chốt ngày 24/11/2026 qua ba vòng phỏng vấn. Đây là **mốc**: mọi quyết định
> thiết kế và kỹ thuật sau này phải đối chiếu được về đây.
>
> Chưa phải system design. Chưa code.

---

## 1. App này là gì

Một app học tâm lý học, **dành trước hết cho sinh viên ngành tâm lý**.

Giảng viên hiện tại cũng chỉ là người học. Chưa có lớp, chưa giao bài, chưa
theo dõi sinh viên. Nhưng mô hình dữ liệu **phải chừa chỗ** để thêm vai trò mà
không đập đi làm lại.

App có **khung kiến thức riêng**, không neo vào giáo trình nào. Không "mở app
cạnh sách giáo trình chương 3"; app tự chịu trách nhiệm về cấu trúc kiến thức
của mình.

## 2. Vì sao sinh viên mở app này ra

Đây là câu nền. Sinh viên tâm lý đã có giáo trình, slide của thầy, Anki, Google
— app này **cạnh tranh thời gian** với chính việc học chính quy của họ.

> **Lý do tới: được *trải nghiệm*, không chỉ được đọc.**
>
> Tự làm thí nghiệm trên chính mình, kéo thử tham số của một mô hình, thấy kết
> quả đổi theo tay mình. Sách không làm được việc đó.

Hệ quả, và đây là chỗ phải nhớ khi thiết kế:

- Gamification là **cơ chế** giữ chân, không phải **lý do** tới. Đừng nhầm hai
  thứ đó. Một app có chuỗi ngày đẹp mà bài học chỉ là chữ thì vẫn thua kỳ thi
  giữa kỳ ngay tuần đầu.
- **Bài học đầu tiên phải chứng minh đúng điều này.** Nếu lát cắt dọc đầu tiên
  không làm người đọc thốt lên "cái này sách không làm được" thì luận điểm sai,
  và nên biết điều đó sớm.
- Ranh giới "không được là một cuốn sách điện tử" ở mục 3 vì thế không phải một
  điều cấm phụ. Nó là **mặt trái của chính luận điểm này**.

## 3. Bốn điều app này dứt khoát không được trở thành

Bốn ranh giới này do chính chủ dự án vạch, và chúng định hình sản phẩm rõ hơn
mọi mục tiêu khẳng định. Khi phân vân giữa hai phương án, chọn phương án ít
trượt về phía bốn cái này hơn.

1. **Một cuốn sách điện tử.** Nếu cuối cùng chỉ là chữ để cuộn thì thất bại.
   Tương tác phải là *cách truyền đạt chính*, không phải thứ rắc lên trên.
2. **Một app trắc nghiệm ôn thi.** Không biến thành ngân hàng câu hỏi luyện thi.
3. **Một app giải trí trá hình.** Nếu gamification lấn tới mức người ta chơi mà
   không học được gì thì thất bại.
4. **Một công cụ tự chẩn đoán.** Không bao giờ để người dùng tự gán nhãn bệnh
   cho mình hay cho người khác.

## 4. Minimalism

Giao diện tối giản. Cụ thể là **không** mang theo bất cứ thứ gì sau đây từ các
bản thiết kế cũ: mảng màu mờ trang trí, bản đồ vùng đất, "màu thế giới" riêng
cho từng chương.

**Hai linh vật Não và Tim đã chốt** (25/11/2026 — nét truyện tranh, có mắt, có
tay chân, có biểu cảm). Chúng **không sống ở vỏ app**: thanh điều hướng và màn
danh sách vẫn trống trải như trên. Chúng sống trong nội dung, trong lúc chuyển
cảnh, và trong những thứ làm ngoài app. Yêu cầu đã dịch sang ngôn ngữ thiết kế
và danh sách tài nguyên phải có: [LINH-VAT.md](LINH-VAT.md).

Ranh giới giữa tối giản và nghèo nàn: **vỏ app gọn, nội dung sống động.** Thanh
điều hướng, màn danh sách, thanh tiến độ — ít màu, ít thứ, ít quyết định. Bên
trong một bài học thì hoạt hoạ và tương tác thoải mái, vì ở đó chúng *là* nội
dung chứ không phải trang trí.

Luật màu giữ từ vòng trước: màu dùng để **mang nghĩa** (đúng, sai, đã xong,
đang khoá), không để làm đẹp.

## 5. "Tối đa hoá tuỳ biến, mở rộng" nghĩa là gì

Hiểu theo nghĩa đen, yêu cầu này dẫn tới một hệ thống plugin tổng quát mà không
ai dùng tới, còn mọi tính năng thật đều phải đi vòng qua nó. Nên nó được dịch
thành một luật **đo được**:

> **Thêm một thứ mới chỉ được chạm vào một chỗ.**

Bốn trục mở rộng đã biết, và cái giá phải trả cho mỗi trục:

| Trục | Thêm một cái nghĩa là | Phải chạm |
|---|---|---|
| Thêm môn, thêm chương, thêm bài | Soạn nội dung | 1 file nội dung |
| Thêm một kiểu tương tác mới | Viết component + khai báo tham số | 1 component + 1 dòng đăng ký |
| Thêm một cơ chế thưởng | Viết một luật nghe sự kiện | 1 luật |
| Thêm một vai trò người dùng | Thêm quyền | 1 chỗ trong mô hình quyền |

Nếu thêm một thứ mà phải sửa bốn chỗ thì kiến trúc sai, bất kể nó trừu tượng
tới đâu.

## 6. Nội dung: tương tác là chính

Một bài học không phải một bài đọc có kèm câu hỏi. Nó là **một chuỗi khối**,
trong đó phần lớn khối là thứ người học *làm* chứ không phải *đọc*.

Các kiểu khối đã thấy là khả thi (từ bản mẫu tham khảo, không phải danh sách
chốt): thí nghiệm tự thân vài giây, không gian chạm tự do nhiều vùng, phân loại
nhận định vào cột, thanh kéo đổi tham số, so sánh hai trường hợp, nhật ký thực
hành.

**Mâu thuẫn trung tâm phải giải ở bước system design:**

> Nội dung tương tác muốn là *code*. Khả năng mở rộng muốn là *dữ liệu*.

Hướng nghiêng về: nội dung là **dữ liệu**, tham chiếu tới một **sổ đăng ký các
component tương tác**, mỗi component có schema riêng cho tham số của nó. Chưa
chốt — đó là việc của system design.

### Lớp hàn lâm (ý tưởng "X-Ray")

Cùng một người, ở hai thời điểm khác nhau, cần hai thứ khác nhau: lần đầu gặp
khái niệm thì cần ví dụ đời thường; tối trước hôm thi thì cần đúng thuật ngữ
gốc, cách phân loại, trích dẫn.

**Chốt: lớp hàn lâm là tuỳ chọn, gắn vào từng khối.** Mỗi khối hiện giọng đời
thường; khối nào có thêm tầng hàn lâm thì bung ra được.

Đã cân nhắc và **loại** phương án công tắc toàn cục bắt buộc hai giọng: nó biến
"mọi khối phải có đủ hai bản" thành ràng buộc cứng trong schema, chi phí soạn
bài gần như gấp đôi vĩnh viễn, và thiếu một khối là công tắc trông như hỏng.
Phương án tuỳ chọn giữ được ý mạnh mà không trả giá đó, và vẫn có thể gom các
tầng hàn lâm thành một công tắc toàn cục **về sau** nếu thấy đáng.

## 7. Gamification

Thưởng cho **bốn** hành vi:

1. Quay lại đều đặn
2. Nhớ lâu
3. Đi sâu và đi rộng
4. Áp dụng vào đời sống

**Kiến trúc:** tầng gamification tách hẳn khỏi phần học và chạy bằng **sự
kiện**. Phần học phát ra sự kiện ("vừa ôn xong", "nhớ được sau 7 ngày", "đã
khám phá hết khối của bài", "đã ghi nhật ký"); luật thưởng đăng ký nghe. Thêm
cơ chế mới là thêm một luật, không sửa phần học.

**Sản phẩm:** xây tầng sự kiện cho cả bốn, nhưng **chỉ cho một hoặc hai cái lộ
ra ngoài ở bản đầu**. Bốn loại phần thưởng trên một màn là bốn thứ tranh nhau
sự chú ý, và khi mọi thứ đều được thưởng thì không gì còn đáng — vừa phá
minimalism vừa trượt về phía "app giải trí trá hình".

## 8. Nhịp sử dụng

Hai lối vào song song:

- **Ngắn (3–5 phút):** ôn vài thẻ, lúc chờ xe buýt.
- **Dài (10–15 phút):** ngồi xuống học trọn một bài.

Đây là lựa chọn có chi phí: nó đòi nội dung vừa cắt được thành mẩu nhỏ trọn
vẹn, vừa ghép lại thành một bài có đầu có đuôi. System design phải giải.

## 9. Ai viết nội dung

**Có người trong ngành cùng làm** — người học hoặc dạy tâm lý tham gia soạn và
duyệt.

Hệ quả bắt buộc: luồng soạn bài phải tính đến **người không biết code**. Chưa
cần dựng công cụ soạn thảo ngay, nhưng mô hình nội dung phải sạch và có schema
rõ tới mức sau này dựng được giao diện soạn đọc ghi đúng mô hình đó, không phải
chuyển đổi dữ liệu.

Luật giữ từ vòng trước: **số liệu nghiên cứu phải có nguồn mở được.** Không bịa
con số, không bịa tên nghiên cứu. Thiếu nguồn thì ghi là thiếu.

## 10. Nội dung sai thì sao

Với một app tâm lý học, **uy tín chính là sản phẩm** — và người dùng mục tiêu
đúng là nhóm biết nghề. Một câu sai tinh vi, nói bằng giọng chắc nịch, không
chỉ bị sửa: nó nói với một giảng viên rằng app không nghiêm túc.

**Chốt: nội dung lên trước, sửa khi có phản hồi.** Không chặn xuất bản để chờ
duyệt.

Kèm theo một điều kiện gần như không tốn gì: **trạng thái duyệt nằm trong dữ
liệu của từng bài** (`chưa duyệt` / `đã duyệt`, kèm ai duyệt và khi nào). Nó
không chặn gì, không làm chậm gì — nó chỉ nói thật. Giao diện có hiện nhãn đó
ra hay không thì quyết sau; điều quan trọng là **dữ liệu phải mang được thông
tin này từ ngày đầu**, vì thêm vào sau thì mọi bài cũ đều không có.

### Thuật ngữ tiếng Việt

Thuật ngữ tâm lý học tiếng Việt chưa thống nhất — mỗi giáo trình dịch một kiểu.
App có khung riêng nên **buộc phải tự chọn bộ thuật ngữ của mình**, và lựa chọn
đó sẽ bị người trong ngành soi.

Chưa chốt bộ nào. Nhưng mô hình nội dung phải coi thuật ngữ là **một thực thể
riêng** (tiếng Việt, tiếng Anh gốc, nguồn của bản dịch), không phải chữ nằm rải
trong bài — nếu không, đổi một cách dịch là phải sửa tay khắp nơi.

### Ranh giới nội dung lâm sàng

Danh mục ngành có Tâm bệnh học, Đánh giá tâm lý, Can thiệp trị liệu trẻ em.
Chúng đụng thẳng vào ranh giới "không được là công cụ tự chẩn đoán".

Bản đầu chưa chạm tới, nên chưa cần quyết. Nhưng ghi lại để không quên: **dạy
*về* rối loạn tâm lý tới mức nào thì dừng** là một câu phải trả lời trước khi
soạn bài đầu tiên của những môn đó.

## 11. Còn bỏ ngỏ

Những câu chưa có đáp án. **Không suy đoán rồi làm theo suy đoán.**

| Câu | Ghi chú |
|---|---|
| Mở app ra, màn đầu tiên là gì | Chủ dự án trả lời "chưa rõ". Quyết ở bước thiết kế, không phải bây giờ. |
| Sẽ có bao nhiêu nội dung trước khi có người thật dùng | "Tuỳ phản hồi". Nghĩa là **chưa dựng công cụ soạn thảo**; nội dung viết tay trong repo trước. |
| **Vạch để biết nên đi tiếp hay dừng** | **Chủ dự án chọn: chưa muốn đặt vạch.** Ghi rõ ở đây để sau không tự trách là đã quên. Hệ quả: chưa có tiêu chí nào để nói bản thử nghiệm thành công hay thất bại. |
| Giảng viên rồi sẽ làm gì | Chỉ cần chừa chỗ, chưa thiết kế. |
| Cơ chế thưởng nào lộ ra ở bản đầu | Quyết khi có bản chạy để nhìn. |
| Ai là người dùng thật đầu tiên, khi nào | Chưa bàn. Sẽ cần trước khi chọn lát cắt dọc đầu tiên. |
| Bộ thuật ngữ tiếng Việt theo chuẩn nào | Xem mục 10. |
| Dạy về rối loạn tâm lý tới mức nào thì dừng | Xem mục 10. Chưa gấp. |
| App miễn phí mãi, hay có mô hình nuôi nó | Chưa bàn. |
| Có chạy offline không | Chưa bàn. Vòng trước làm PWA chạy offline được. |
| Nhật ký thực hành | Đã có luật riêng tư từ vòng trước (không log, không analytics, không gửi đi đâu). Cần nâng thành cam kết sản phẩm khi làm tới. |

## 12. Tài liệu tham khảo và quan hệ với chúng

Ba tài liệu đã đọc, **tất cả chỉ là tham khảo về tầm nhìn**, không phải đặc tả:

| Tài liệu | Giữ gì | Bỏ gì |
|---|---|---|
| `tai-lieu-ban-giao-ky-thuat.md` (23/11) | Danh mục môn, khung chương, ý thức về quyền riêng tư và miễn trừ | Linh vật, bản đồ đảo, ba tầng cố định, hệ màu ấm, Firebase |
| `mindmap-hanh-trinh.md` | Phạm vi môn học của ngành | Cấu trúc 5 chặng cố định |
| Hai bản mẫu Gemini | Ý tưởng lớp hàn lâm, các kiểu khối tương tác | Mọi thứ còn lại |

Tài liệu bàn giao thiết kế cho **người mới hoàn toàn** và cố ý xếp "đang học
trên lớp" vào diện sắp có. Core concept này đảo ngược đúng chỗ đó.
