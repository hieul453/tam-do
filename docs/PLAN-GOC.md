# PLAN.md – Kế hoạch xây Tâm Đồ v1

> Đọc **CLAUDE.md** trước. File này chia việc thành các bước nhỏ.
> **Quy tắc:** làm xong một bước → cho Diễm xem (chạy thử hoặc ảnh chụp) → Diễm duyệt → đánh dấu ✅ → mới sang bước sau.
> Giao diện màn nào chưa có trong thiết kế mẫu thì **vẽ bản mẫu tĩnh trước, duyệt rồi mới code**.
> Trạng thái: ⬜ chưa làm · 🔄 đang làm · ✅ đã duyệt

---

## Đường chính: xây app

### Bước 0 – Chuẩn bị ⬜
- **Mục tiêu:** có repo và môi trường chạy được.
- **Việc:** xác nhận stack (Vite + React + TypeScript); tạo repo; đặt `CLAUDE.md`, `PLAN.md`, `content/` vào gốc; tạo dự án Firebase (gói Spark), bật Hosting, Authentication (Google), Firestore.
- **Duyệt khi:** chạy `npm run dev` thấy trang trống; Diễm đã có dự án Firebase.

### Bước 1 – Nền giao diện ⬜
- **Mục tiêu:** bộ "gạch" dùng chung đúng thiết kế mẫu.
- **Việc:** màu, chữ (Lora, Be Vietnam Pro), bo góc, bóng đổ thành biến CSS; nút, thẻ, thanh tiến độ, vòng mục tiêu; bộ icon SVG; Não và Tim thành component (có biểu cảm: vui, vẫy tay, suy nghĩ); thanh 5 tab nổi; điều hướng giữa 5 tab (màn trống).
- **Duyệt khi:** trang "bộ mẫu" hiện đủ thành phần, giống thiết kế mẫu trên điện thoại thật.

### Bước 2 – Nội dung thành dữ liệu ⬜
- **Mục tiêu:** app đọc được nội dung từ `content/`.
- **Việc:** định nghĩa kiểu dữ liệu (mô hình ở CLAUDE.md mục 10); script chuyển Markdown → JSON; kiểm tra thiếu trường thì báo lỗi; dữ liệu chặng / môn (môn chưa có nội dung = "sắp có"); chuyển chương 6.
- **Duyệt khi:** script chạy không lỗi, ra JSON đủ 7 bài chương 6.

### Bước 3 – Trình đọc bài 3 tầng ⬜
- **Mục tiêu:** học trọn một bài.
- **Việc:** Hiểu nhanh (thẻ vuốt, thẻ đoán thử, thẻ kiểm tra đáp án ẩn, thẻ tương tác: dãy số 3 giây, 10 từ, danh sách DRM); Đào sâu (câu chuyện, "Nghĩa là", bảng, hộp Cập nhật kiến thức, 3 điều cần nhớ, Mở rộng ẩn); Áp dụng (thử thách, câu hỏi tự soi, dùng ngay); chạm chữ gạch chân xem thuật ngữ; giữ lâu lưu thẻ. Biểu đồ chương 6 bằng SVG theo dòng 🎨 Minh họa.
- **Duyệt khi:** Diễm học hết bài 6.6 trên điện thoại và thấy dễ đọc, không ngợp.

### Bước 4 – Bản đồ Hành trình ⬜
- **Mục tiêu:** 4 cấp phóng to.
- **Việc:** vùng đất minh họa (theo thiết kế mẫu) → chặng → môn (con đường các chương) → chương (sơ đồ bài) → bài; tiến độ thật; ngã rẽ và 3 nhánh khóa nhẹ.
- **Duyệt khi:** đi từ toàn cảnh xuống bài 6.4 và quay lại mượt.

### Bước 5 – Lưu tiến độ trên máy + ôn giãn cách ⬜
- **Mục tiêu:** app nhớ mình học tới đâu, biết hôm nay ôn gì.
- **Việc:** lưu trên máy (IndexedDB); đánh dấu từng tầng; lịch ôn từng thẻ (Quên / Mờ / Rõ); chuỗi ngày, mục tiêu phút; tab **Hôm nay** dùng số liệu thật.
- **Duyệt khi:** học vài thẻ hôm nay, hôm sau tab Hôm nay hiện đúng thẻ đến hạn.

### Bước 6 – Sổ tay và Áp dụng ⬜
- **Việc:** tab Sổ tay (thẻ đã lưu, ghi chú, từ điển thuật ngữ, Cập nhật kiến thức, ôn theo chủ đề); tab Áp dụng (thử thách đang làm / đã xong, nhật ký áp dụng); 🔍 tìm kiếm toàn app.
- **Duyệt khi:** lưu thẻ, viết nhật ký, tìm "Loftus" đều ra đúng.

### Bước 7 – Hướng dẫn người mới ⬜
- **Việc:** màn hình chào → thí nghiệm Stroop (~20 giây) → giải thích, thẻ đầu tiên vào sổ tay → chọn vai + mục tiêu → học thao tác trên một thẻ → huy hiệu "Nhà thám hiểm tâm trí"; bỏ qua được; nút "?" mở lại.
- **Duyệt khi:** một người chưa biết gì về app tự đi hết trong khoảng 2 phút.

### Bước 8 – Tài khoản Firebase ⬜
- **Việc:** đăng nhập Google (phương án B: dùng thử trước, đăng nhập sau); chuyển dữ liệu từ máy lên Firestore; đồng bộ nhiều máy; security rules chỉ cho chủ dữ liệu; ghi theo lô để nằm trong hạn mức Spark.
- **Duyệt khi:** học trên điện thoại, mở máy tính thấy cùng tiến độ; thử đọc dữ liệu người khác bị chặn.

### Bước 9 – Tab Tôi, riêng tư, hoàn thiện ⬜
- **Việc:** tiến độ "bộ não lớn lên", huy hiệu, cài đặt (mục tiêu, giờ nhắc, cỡ chữ, chế độ tối); xuất dữ liệu; xóa tài khoản và dữ liệu; trang Quyền riêng tư và lời nhắc miễn trừ; PWA (icon Ψ, cài lên màn hình chính, chạy khi mất mạng phần nội dung đã tải); kiểm tra tương phản, `prefers-reduced-motion`.
- **Duyệt khi:** cài app lên điện thoại như app thật; xuất và xóa dữ liệu hoạt động.

### Bước 10 – Đưa lên mạng ⬜
- **Việc:** deploy Firebase Hosting; Diễm dùng thật 1 tuần; ghi lại lỗi và góp ý; sửa.
- **Duyệt khi:** Diễm dùng hằng ngày 1 tuần mà không gặp lỗi chặn.

---

## Đường song song: nội dung (chương 1 → 16)

Mỗi chương: soạn theo khuôn (CLAUDE.md mục 6), kiểm chứng mọi con số bằng nguồn đã mở, có dòng 🎨 Minh họa cho từng bài, tổng kết chương → Diễm duyệt → xuất vào `content/chuong-XX-....md` → build lại.

| Chương | Trạng thái |
|---|---|
| 6. Trí nhớ | ✅ (đã xuất) |
| 1. TLH là gì và đến từ đâu | ⬜ (làm tiếp theo) |
| 2. Các lĩnh vực và phương pháp nghiên cứu | ⬜ |
| 3. Cơ sở tự nhiên và xã hội của tâm lý | ⬜ |
| 4. Ý thức | ⬜ |
| 5. Cảm giác và tri giác | ⬜ |
| 7. Học tập | ⬜ |
| 8. Ngôn ngữ và tư duy | ⬜ |
| 9. Cảm xúc và động lực | ⬜ |
| 10. Phát triển tâm lý | ⬜ |
| 11. Trí thông minh | ⬜ |
| 12. Nhân cách và khác biệt cá nhân | ⬜ |
| 13. Tâm lý học xã hội | ⬜ |
| 14. Rối loạn tâm lý và trị liệu | ⬜ |
| 15. Stress, sức khỏe và hạnh phúc | ⬜ |
| 16. Ứng dụng tâm lý học | ⬜ |

Đường nội dung không phải chờ đường app: chương nào xong là thêm vào được.
