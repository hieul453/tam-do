# CLAUDE.md – Dự án Tâm Đồ (tên tạm)

> Web app ôn tập kiến thức tâm lý học, thú vị như một trò chơi, sâu đến mức cao học, và áp dụng được vào đời sống.
> File này tổng hợp mọi quyết định đã chốt trong các buổi trao đổi (cập nhật 18/11/2026, bản 2). Đọc hết file trước khi làm bất cứ việc gì.
> Kế hoạch từng bước nằm trong **PLAN.md**. Nội dung nằm trong thư mục **content/**.

---

## 1. Bối cảnh

- **Chủ dự án:** Diễm, cử nhân Tâm lý học (hệ VB2, khóa K22.2, Trường ĐH KHXH&NV – ĐHQG TP.HCM), định hướng Tâm lý học Tổ chức – Nhân sự (I/O). Đang làm kinh doanh phần mềm.
- **Ngôn ngữ:** toàn bộ giao diện và nội dung bằng **tiếng Việt**; thuật ngữ kèm tiếng Anh.
- **Cách làm việc với Diễm:**
  - Trao đổi và chốt trước, rồi mới làm. Không dựng demo sau mỗi câu nói.
  - Trình bày có hệ thống, dễ hiểu, thú vị. Tránh chuỗi câu hỏi mở rời rạc.
  - Diễm có nhiều thời gian và muốn đi nhanh ("tốc lực").
  - **Làm từng bước theo PLAN.md. Xong bước nào, dừng lại cho Diễm duyệt rồi mới sang bước sau.**
  - Giao diện: luôn có **bản mẫu tĩnh (thiết kế) được duyệt trước**, rồi mới code.

## 2. Mục tiêu (theo thứ tự ưu tiên)

1. Ôn tập kiến thức cho bản thân Diễm
2. Nghề nghiệp và portfolio (hướng I/O, học thạc sĩ, kênh YouTube về I/O Psychology)
3. Chia sẻ cho cộng đồng sinh viên tâm lý

## 3. Hướng đi và lộ trình

**Hướng A – Nền tảng trước** (đã chốt):

| Phiên bản | Nội dung |
|---|---|
| **v1** | "Tâm lý học nền tảng": môn **TLH đại cương**, 16 chương, đủ 3 tầng, chế độ Ôn tập |
| v2 | Nhánh Tổ chức – Nhân sự (5–6 môn) |
| v3 | Các môn nền còn lại (mở rộng từ các chương của v1) |
| v4 | Cộng đồng và các nhánh khác (có cộng tác viên duyệt) |

**Nguyên tắc:** nội dung trước, giao diện sau. Xong chương nào dùng ôn được ngay chương đó.

## 4. Người dùng

- Xây cho Diễm trước: chế độ **Ôn tập / Tra cứu** (người đã học xong).
- Chế độ "Đang học" và "Hoàn toàn mới" làm sau, nhưng **thứ tự học và điều kiện tiên quyết phải có trong dữ liệu ngay từ đầu**.

## 5. Cấu trúc kiến thức

### Tách kiến thức khỏi môn học
Kiến thức là "bản đồ" ổn định; chương trình đào tạo của từng trường là "tuyến xe buýt" chạy qua bản đồ. Khi trường đổi chương trình, chỉ thêm lộ trình mới, không làm lại nội dung.

### Hành trình theo chặng (logic kiến thức, không theo thời khóa biểu)

1. **Nhập môn:** TLH đại cương → Lịch sử TLH
2. **Nền sinh học:** Giải phẫu sinh lý HĐTKCC → TLH thần kinh
3. **Các mặt tâm lý cơ bản:** TLH nhận thức, TLH phát triển, TLH nhân cách, TLH xã hội
4. **Công cụ khoa học:** Phương pháp luận & PPNC → Thống kê (Tiếng Anh chuyên ngành song song)
5. **Sức khỏe tâm thần & hỗ trợ:** Tâm bệnh học → Đánh giá tâm lý → Kỹ năng tham vấn → Các tiếp cận tham vấn trị liệu
6. **Ngã rẽ → các nhánh:** Tổ chức – Nhân sự (Hành vi tổ chức, TLH tổ chức – nhân sự, TLH quản lý, Đào tạo & PTNS, Tuyển dụng & PT nhân tài); Lâm sàng (gồm Tâm bệnh học phát triển, Nhập môn TLH lâm sàng); Giáo dục
7. **Chuyên đề tự chọn:** TLH gia đình, TLH pháp lý, TLH giới tính

Ngã rẽ mở khi xong khoảng 70% phần nền tảng (khóa nhẹ: vẫn xem trước được).

### Khung môn TLH đại cương (16 chương, khoảng 104 bài)
Phần I – Nền móng: 1. TLH là gì và đến từ đâu · 2. Các lĩnh vực và phương pháp nghiên cứu · 3. Cơ sở tự nhiên và xã hội của tâm lý
Phần II – Tâm trí nhận thức: 4. Ý thức · 5. Cảm giác và tri giác · 6. Trí nhớ · 7. Học tập · 8. Ngôn ngữ và tư duy
Phần III – Con người vận động và phát triển: 9. Cảm xúc và động lực · 10. Phát triển tâm lý · 11. Trí thông minh · 12. Nhân cách và khác biệt cá nhân
Phần IV – Con người trong xã hội và sức khỏe: 13. TLH xã hội · 14. Rối loạn tâm lý và trị liệu · 15. Stress, sức khỏe và hạnh phúc · 16. Ứng dụng tâm lý học

Danh sách bài chi tiết của từng chương: `content/khung-tlh-dai-cuong.md`.

**Nhãn bài:** 🟢 trọng tâm · 🔵 mở rộng · ⚠️ đã cập nhật · 🇻🇳 riêng giáo trình Việt Nam

## 6. Khuôn bài học (đã chốt sau bài mẫu 6.6)

**Phân vai 3 tầng để không lặp:**
- ⚡ **Hiểu nhanh** = *cái gì*, bằng trực giác
- 📖 **Đào sâu** = *vì sao*, bằng câu chuyện nghiên cứu và bằng chứng
- 🌱 **Áp dụng** = *làm gì*, bằng hành động cụ thể

**Tên bài:** dạng câu hỏi đời thường (ví dụ "Vì sao ta có thể nhớ sai mà vẫn rất chắc chắn?").

### ⚡ Hiểu nhanh (5–6 thẻ)
- Mỗi thẻ **một ý**, một màn hình điện thoại.
- Các loại thẻ: đoán thử, ý chính, thẻ hình, thẻ tương tác "thử ngay" (ít nhất 1 thẻ khi chủ đề cho phép), ví dụ, kiểm tra.
- Thẻ kiểm tra cuối là **tình huống áp dụng**, đáp án ẩn, phải trả lời mới đi tiếp.

### 📖 Đào sâu (5–8 phút đọc)
Thứ tự cố định:
1. "Đọc xong bạn sẽ hiểu…" + thời gian đọc
2. Đoạn mở bằng lời thường
3. 1–2 **"Câu chuyện"** nghiên cứu: bối cảnh → làm gì → phát hiện, kết bằng **"Nghĩa là:"**
4. 1 bảng hoặc hình
5. Hộp **"Cập nhật kiến thức"** (⚠️ đã được điều chỉnh / 🇻🇳 khác cách gọi trong giáo trình VN)
6. **"Còn đang tranh cãi"**: chỉ khi thật sự có tranh cãi đáng biết
7. **"3 điều cần nhớ"**
8. **"Mở rộng"** (ẩn, chạm để xem): thuật ngữ Việt – Anh, liên kết môn khác, nguồn đã kiểm chứng

Tên tác giả và năm **không chen dày trong câu**; để ở phần Mở rộng.

### 🌱 Áp dụng
- **Thử thách nhỏ** có thời hạn (vài ngày), ghi vào **nhật ký áp dụng**
- **Câu hỏi tự soi**
- **Dùng ngay**: việc làm được ngay hôm nay
- **"Khi nào nên tìm chuyên gia"** ở các bài liên quan sức khỏe tâm thần, ký ức đau buồn…
- **Không có công cụ tự chẩn đoán.**

### 🎨 Minh họa
- Mỗi bài 3–5 minh họa: thẻ tương tác, biểu đồ số liệu, sơ đồ, hình minh họa câu chuyện, hộp nổi bật.
- Từ chương 1 trở đi, mỗi bài trong nội dung có dòng **"🎨 Minh họa: …"** liệt kê hình cần làm.
- Biểu đồ và sơ đồ **vẽ bằng code** (SVG) để số liệu khớp nguồn.
- **Không** lấy hình từ slide hoặc giáo trình. **Không** dùng ảnh thật của người (kể cả nhân vật nổi tiếng như H.M.); dùng hình vẽ minh họa.

### Tổng kết chương
Chỉ gồm **"Những điều cần nắm"** và **"Áp dụng cho bản thân"**. **Không** có câu hỏi tự luận, đề ôn thi (Diễm thấy nặng nề kiểu học thi).

## 7. Nguồn và độ chính xác

| Vai trò | Nguồn |
|---|---|
| Khung môn | Đề cương chi tiết học phần, tài liệu thư viện lớp VB2 K22.2 (Google Drive, mục 12) |
| Giáo trình chính TLH đại cương | Schacter, Gilbert, Wegner – *Psychology* (Worth; đề cương ghi bản 2009, slide dùng 2011) |
| Giáo trình tiếng Việt | Nguyễn Xuân Thức (chb.) – *TLH đại cương*, NXB ĐHSP (2011); Feldman – *Tâm lý học căn bản* |
| Cập nhật | OpenStax *Psychology 2e* (CC BY 4.0), NOBA Project, nghiên cứu tổng quan, nghiên cứu lặp lại, DSM-5-TR / ICD-11 |

**Quy tắc bắt buộc:**
- Mọi con số, dữ kiện nghiên cứu phải **kiểm chứng bằng nguồn đã mở thật** trước khi đưa vào; ghi link ở phần Mở rộng.
- Ưu tiên kiểm tra các nghiên cứu kinh điển đã được **làm lại** (replication). Ví dụ đã phát hiện: thí nghiệm thợ lặn Godden & Baddeley (1975) không lặp lại được (Murre, 2021); "mồi hành vi" của Bargh (1996) không lặp lại được (Doyen và cộng sự, 2012).
- Sách tải từ nguồn không chính thức trong thư viện lớp **chỉ dùng tham khảo**, không đưa nguyên văn lên app.
- Viết lại bằng lời của mình, không chép nguyên văn giáo trình hay slide.

## 8. Trải nghiệm người dùng

### Hướng dẫn người mới (lần đầu mở app, khoảng 2 phút, bỏ qua được)
1. **Màn hình chào:** tên app, khẩu hiệu "Bản đồ tâm lý học của riêng bạn", nút "Bắt đầu hành trình".
2. **Thí nghiệm đầu tiên:** hiệu ứng Stroop (chọn màu chữ, không phải nghĩa chữ; 10 chữ, khoảng 20 giây).
3. **Hiểu điều vừa xảy ra:** "trải nghiệm trước, hiểu sau"; thẻ đầu tiên vào sổ tay.
4. **Chọn vai:** đã học xong / đang học / hoàn toàn mới (v1 chỉ chế độ ôn tập, hai lựa chọn kia ghi "sắp có") + mục tiêu mỗi ngày (5 / 10 / 15 phút).
5. **Học thao tác bằng chính một thẻ:** vuốt sang = thẻ tiếp; chạm chữ gạch chân = xem thuật ngữ; giữ lâu = lưu vào sổ tay. Nhận huy hiệu "Nhà thám hiểm tâm trí".

Sau đó: gợi ý nhỏ đúng lúc khi lần đầu gặp tính năng mới; nút "?" mở lại hướng dẫn.

**Linh vật:** bộ đôi **Não và Tim** (xem mục 9). Xuất hiện vừa đủ, nhắc mẹo, không làm phiền. (Thay cho "Nơ" – tế bào thần kinh – của bản trước.)

### Đường đi
- Lần đầu: Màn hình chào → hướng dẫn → **Toàn cảnh hành trình**.
- Những lần sau: mở app vào thẳng tab **Hôm nay**.

### 4 cấp phóng to
1. **Toàn cảnh:** con đường 5 chặng → ngã rẽ → 3 nhánh (khóa)
2. **Chặng:** các môn, tiến độ, "Học xong chặng này bạn sẽ…"
3. **Môn → Chương:** con đường các trạm (chương), rồi sơ đồ các bài trong chương
4. **Bài:** 3 tab Hiểu nhanh / Đào sâu / Áp dụng

Môn chưa có nội dung vẫn hiện trên bản đồ, gắn nhãn **"sắp có"**.

### 5 tab (thanh dưới) – phương án C, đã chốt

Biểu tượng 🔍 **Tìm kiếm** nằm góc trên mọi màn hình (không chiếm tab).

| Tab | Câu hỏi | v1 | Làm sau |
|---|---|---|---|
| 🏠 **Hôm nay** | Hôm nay học gì? | Lời chào + chuỗi ngày + vòng mục tiêu; **Ôn hôm nay** (thẻ đến hạn, Quên / Mờ / Rõ, ôn giãn cách); Học tiếp; Thử thách đang làm | "Bạn có biết?" mỗi ngày |
| 🗺️ **Hành trình** | Mình đang ở đâu? | Bản đồ vùng đất minh họa; chặng → môn → chương → bài; lọc trọng tâm / mở rộng | Tick "đã học trên lớp" |
| 📖 **Sổ tay** | Mình đã gom được gì? | Thẻ đã lưu; Ghi chú của tôi; Từ điển thuật ngữ Việt – Anh; **Cập nhật kiến thức** (gom mọi hộp ⚠️ / 🇻🇳); Ôn theo chủ đề | Tra theo nghiên cứu kinh điển, nhà tâm lý học |
| 🌱 **Áp dụng** | Mình đã sống với kiến thức chưa? | Thử thách (đang làm / đã xong); **Nhật ký áp dụng** | Thám tử tâm lý (tình huống trộn nhiều chương) |
| 👤 **Tôi** | Đã đi được bao xa? | Tiến độ ("bộ não của bạn lớn lên": mạng lưới sáng dần theo bài đã học); huy hiệu; Cài đặt (mục tiêu, giờ nhắc, cỡ chữ, chế độ tối); **sao lưu / xuất dữ liệu**; **xóa tài khoản và dữ liệu** | |

### Game hóa
Ở mức nhẹ: chuỗi ngày, huy hiệu, bản đồ và "bộ não" sáng dần. Nhấn vào tiến bộ thật ("đã giải thích được 12 khái niệm") hơn là điểm số. Bản đồ chỉ là bức tranh tiến độ theo thứ tự chặng, **không** phải nơi nhảy bài tự do.

## 9. Giao diện và nhận diện (đã chốt)

**Thiết kế mẫu (high-fidelity), làm theo đúng bản này:** https://claude.ai/artifact/DHvWtn4YUBAMtTeqcLqewS
Gồm 4 bảng: Màn hình chào · Tab Hôm nay · Bản đồ Hành trình · Nhận diện (logo, màu, chữ, linh vật).

**Phong cách "Ấm áp, dịu dàng, có hồn":**
- Nền kem hồng có vài mảng màu mờ lan nhẹ; thẻ bo tròn lớn (22–28px), bóng đổ mềm; biểu tượng kiểu sticker.
- Không nhân vật 3D. Biểu tượng là SVG nét (không dùng emoji trong giao diện thật).
- Chuyển động nhẹ: linh vật nhún, vòng sáng "bạn đang ở đây" nhấp nháy, chuyển trang mượt. Tôn trọng `prefers-reduced-motion`.

**Màu:**

| Tên | Mã | Dùng cho |
|---|---|---|
| Kem hồng | #FFF6F1 | nền |
| Hồng san hô | #F2788A | màu chính, Tim |
| Hồng đậm | #C24D63 | nút, liên kết |
| Hồng phấn | #F7A8B6 | Não |
| Đào | #FFB38A / #FFC9A8 | phụ, chuyển màu |
| Vàng bơ | #FFE3B0 | thử thách |
| Xanh xô thơm | #7FA88B | hoàn thành |
| Oải hương | #B7A6EC | màu chương Trí nhớ (mỗi chương một "màu thế giới") |
| Mận chín | #6E3443 | thanh tab |
| Nâu ca cao | #3D2A2E / #7A5F64 | chữ / chữ phụ |

Độ tương phản chữ tối thiểu 4.5:1.

**Chữ:** Lora (tiêu đề, có chân) + Be Vietnam Pro (nội dung). Cả hai đủ dấu tiếng Việt, lấy từ Google Fonts.

**Linh vật Não và Tim:** Não (bộ não hồng phấn) dẫn phần kiến thức: Hiểu nhanh, Đào sâu, ôn thẻ. Tim (trái tim san hô) đồng hành ở Áp dụng, nhật ký, lời động viên. Hai bạn nắm tay nhau = "lý trí và cảm xúc đi cùng nhau".

**Logo:** chữ Ψ trắng trên nền chuyển hồng → đào, Não và Tim đứng trên hai nhánh chữ. Cỡ nhỏ (favicon, 32–64px) chỉ giữ Ψ. Đây là **nét vẽ riêng của Tâm Đồ**: ý tưởng lấy cảm hứng từ một sticker tham khảo (sách + não bắt tay tim + Ψ) nhưng **không dùng lại hình đó**.

**Hình minh họa:** hình bìa chương kiểu "người với hình ẩn dụ trên đầu"; bản đồ là vùng đất minh họa (mỗi chặng một vùng, mỗi môn một cột mốc); chồng sách là ẩn dụ tiến độ. v1 vẽ bằng SVG trong code. Muốn đẹp hơn: sau này nhờ họa sĩ hoặc công cụ AI vẽ tranh, giữ đúng bảng màu và nét.

## 10. Kỹ thuật (đã chốt Firebase)

- **Web app mobile-first, dạng PWA** (thêm vào màn hình chính như app).
- Gợi ý stack (xác nhận ở bước 0 của PLAN.md): Vite + React + TypeScript. Biểu đồ, sơ đồ vẽ bằng SVG trong code.
- **Firebase, gói miễn phí Spark:**
  - **Hosting:** chứa web app và nội dung (file JSON tĩnh sinh từ `content/`).
  - **Authentication – phương án B:** dùng thử ngay không cần đăng nhập (lưu trên máy); khi muốn giữ tiến độ thì **đăng nhập Google**, dữ liệu trên máy được chuyển lên tài khoản.
  - **Firestore:** dữ liệu riêng từng người: tiến độ, lịch ôn từng thẻ, nhật ký áp dụng, ghi chú, chuỗi ngày, cài đặt.
  - **Security rules:** mỗi người chỉ đọc / ghi được dữ liệu của chính mình (`users/{uid}/...`).
  - **Không dùng Cloud Storage** (không có trong gói Spark). Hình là SVG trong code hoặc file tĩnh trên Hosting.
  - Hạn mức Spark cần nhớ: Firestore 1 GiB, 50.000 lượt đọc / 20.000 lượt ghi mỗi ngày; Hosting 10 GB lưu trữ, 360 MB truyền tải mỗi ngày. Ghi theo lô, tránh ghi mỗi lần vuốt thẻ.
- **Riêng tư:** nhật ký áp dụng là dữ liệu nhạy cảm. Trang "Quyền riêng tư" nói rõ lưu gì, ở đâu; có nút **xuất dữ liệu** và **xóa tài khoản kèm toàn bộ dữ liệu**. Không phân tích, không chia sẻ nhật ký.
- **Lời nhắc miễn trừ:** app là công cụ học tập, **không thay thế** chẩn đoán hay trị liệu; các bài liên quan sức khỏe tâm thần có mục "Khi nào nên tìm chuyên gia".

### Quy trình nội dung
1. Soạn và duyệt trong Claude Doc (hoặc trò chuyện) theo khuôn mục 6.
2. Khi chương được duyệt: **xuất sang Markdown trong `content/`**. Từ đó **file trong repo là bản gốc**; sửa nội dung thì sửa file.
3. Script build chuyển Markdown → JSON theo mô hình dữ liệu dưới đây; kiểm tra thiếu trường (ví dụ bài thiếu thẻ kiểm tra, thiếu nguồn) thì báo lỗi.

### Gợi ý mô hình dữ liệu

```
Stage (chặng)      id, order, title, summary, outcomes[], branch?  (core | io | clinical | edu | elective)
Course (môn)       id, stageId, order, title, bigQuestion, prerequisites[], status (ready | coming_soon)
Chapter (chương)   id, courseId, order, title, question, lessonIds[], summary { keyPoints[], applyToSelf[] }
Lesson (bài)       id, chapterId, order, title (câu hỏi), tags[] (core | extended | updated | vn)
                   quick:   Card[]
                   deep:    { willUnderstand, readingMinutes, intro, stories[], table?, update?, debate?,
                              keyTakeaways[3], terms[], links[], sources[] }
                   apply:   { challenge { days, task, logPrompt }, reflection, doNow[], seekHelp? }
                   illustrations[]  (mô tả hình cần làm)
Card (thẻ)         id, type (guess | idea | image | interactive | example | check), body,
                   options?, answer?, explanation?, interactiveKind?
Story              title, body, meaning ("Nghĩa là")
Term               vi, en, definition, lessonId
Source             title, url, note
Curriculum (lộ trình theo trường)  id, school, year, courses[] → ánh xạ tới Course / Chapter
```

Dữ liệu người dùng (Firestore, `users/{uid}`): `progress/{lessonId}` (từng tầng), `reviews/{cardId}` (lịch ôn), `journal/{entryId}`, `notes/{id}`, `savedCards/{cardId}`, `profile` (mục tiêu, chuỗi ngày, cài đặt, huy hiệu).

## 11. Hiện trạng

- ✅ Ý tưởng, mục tiêu, hướng đi, cấu trúc, khuôn bài, trải nghiệm, 5 tab, kỹ thuật (Firebase B), phong cách, linh vật, logo: đã chốt (file này).
- ✅ Thiết kế mẫu 4 bảng (mục 9).
- ✅ `content/khung-tlh-dai-cuong.md`: khung 16 chương, khoảng 104 bài.
- ✅ `content/chuong-06-tri-nho.md`: 7 bài đủ 3 tầng, số liệu đã kiểm chứng, có dòng 🎨 Minh họa, tổng kết chương.
- ⏳ Chưa có code. Bắt đầu từ **bước 0 trong PLAN.md**.
- Còn mở: tên app chính thức ("Tâm Đồ" là tên tạm); cách làm hình minh họa cao cấp (họa sĩ hay AI).

## 12. Liên kết

- Thiết kế mẫu: https://claude.ai/artifact/DHvWtn4YUBAMtTeqcLqewS
- Claude Doc nội dung (bản soạn, nay đã xuất sang `content/`): https://claude.ai/artifact/Qf2D9hHY6kp24uAZuifoTZ
- Demo cũ phong cách "vũ trụ" (chỉ tham khảo, đã bỏ): https://claude.ai/artifact/UF7WvsYsVfSbSzWbMUT9GZ
- Tài liệu quyết định trong Project "Psychology": `claude/tam-do-cac-quyet-dinh.md`
- Thư viện lớp VB2 K22.2 (Google Drive): https://drive.google.com/drive/folders/1COg3-TdnZSzCz36NyMKH134G46XuQ9qz
  - TLH đại cương: thư mục `M.03-TLHĐC…/M.03-TLGV-20032023` (đề cương 2020, giáo trình, slide từng chủ đề)
