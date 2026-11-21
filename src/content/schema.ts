import { z } from 'zod'

/**
 * Hình dạng của nội dung bài học sau khi đã chuyển từ markdown sang dữ liệu.
 *
 * Đây là bản hợp đồng giữa người soạn nội dung và app. Script build kiểm tra
 * mọi file `content/*.md` theo schema này; thiếu mục nào thì CI đỏ, không để
 * lọt lên bản live.
 *
 * Tên trường bằng tiếng Việt không dấu, để người soạn nội dung đọc thông báo
 * lỗi cũng hiểu được nó đang nói về phần nào của bài.
 */

/** Nhãn bài, lấy từ emoji ở cuối dòng tiêu đề trong markdown. */
export const NhanBai = z.enum([
  'trong-tam', // 🟢 có trong đề cương và slide lớp
  'mo-rong', // 🔵 giáo trình quốc tế có, lớp chưa dạy kỹ
  'da-cap-nhat', // ⚠️ nghiên cứu mới đã điều chỉnh
  'viet-nam', // 🇻🇳 cách tiếp cận riêng của giáo trình tiếng Việt
])
export type NhanBai = z.infer<typeof NhanBai>

/** Loại thẻ ở tầng Hiểu nhanh, suy ra từ nhãn in đậm đầu mỗi gạch đầu dòng. */
export const LoaiThe = z.enum([
  'doan-thu', // Đoán thử
  'y-chinh', // Ý chính, Ý chính 2, Kết quả, Mẹo
  'hinh', // Hình dung
  'tuong-tac', // Thử ngay, Xếp nhóm
  'vi-du', // Ví dụ
  'kiem-tra', // Kiểm tra (áp dụng) — luôn là thẻ cuối
])
export type LoaiThe = z.infer<typeof LoaiThe>

export const The = z.object({
  id: z.string(),
  loai: LoaiThe,
  /** Nhãn nguyên văn trong markdown, ví dụ "Ý chính 2". Giữ lại để hiện đúng chữ người soạn viết. */
  nhan: z.string().min(1),
  noiDung: z.string().min(1),
})
export type The = z.infer<typeof The>

export const CauChuyen = z.object({
  tieuDe: z.string().min(1),
  than: z.string().min(1),
  /** Câu kết "Nghĩa là:" — phần rút ra ý nghĩa của nghiên cứu. */
  nghiaLa: z.string().nullable(),
})
export type CauChuyen = z.infer<typeof CauChuyen>

export const ThuatNgu = z.object({
  vi: z.string().min(1),
  en: z.string().nullable(),
})
export type ThuatNgu = z.infer<typeof ThuatNgu>

export const Nguon = z.object({
  ten: z.string().min(1),
  url: z.string().url().nullable(),
})
export type Nguon = z.infer<typeof Nguon>

export const DaoSau = z.object({
  /** Câu "Đọc xong bạn sẽ hiểu…" mở đầu tầng Đào sâu. */
  seHieu: z.string().min(1),
  phutDoc: z.number().int().positive().nullable(),
  /** Toàn bộ phần thân, giữ nguyên markdown để render (bảng, in đậm, liên kết). */
  than: z.string().min(1),
  cauChuyen: z.array(CauChuyen),
  /** Hộp ⚠️ hoặc 🇻🇳 "Cập nhật kiến thức". */
  capNhat: z.string().nullable(),
  tranhCai: z.string().nullable(),
  baDieuCanNho: z.array(z.string().min(1)).length(3),
  thuatNgu: z.array(ThuatNgu),
  lienKet: z.array(z.string()),
  nguon: z.array(Nguon).min(1),
})
export type DaoSau = z.infer<typeof DaoSau>

export const ApDung = z.object({
  thuThach: z.object({
    /** Nguyên văn nhãn, ví dụ "Thử thách 3 ngày" — thời hạn nằm trong đó. */
    nhan: z.string().min(1),
    noiDung: z.string().min(1),
  }),
  tuSoi: z.string().min(1),
  dungNgay: z.string().min(1),
  /** Chỉ có ở các bài liên quan sức khỏe tâm thần. */
  timChuyenGia: z.string().nullable(),
})
export type ApDung = z.infer<typeof ApDung>

export const Bai = z
  .object({
    id: z.string(), // tlhdc-06-01
    so: z.string(), // "6.1"
    thuTu: z.number().int().positive(),
    tieuDe: z.string().min(1),
    nhan: z.array(NhanBai),
    /** Mô tả các hình cần vẽ, lấy từ dòng "🎨 Minh họa:". */
    minhHoa: z.array(z.string()),
    hieuNhanh: z.array(The).min(3),
    daoSau: DaoSau,
    apDung: ApDung,
  })
  .refine((b) => b.hieuNhanh[b.hieuNhanh.length - 1]?.loai === 'kiem-tra', {
    message:
      'Thẻ cuối của Hiểu nhanh phải là thẻ "Kiểm tra (áp dụng)" — người học phải trả lời mới đi tiếp',
    path: ['hieuNhanh'],
  })
export type Bai = z.infer<typeof Bai>

export const Chuong = z.object({
  id: z.string(), // tlhdc-06
  so: z.number().int().positive(),
  tieuDe: z.string().min(1),
  cauHoiChuong: z.string().min(1),
  bai: z.array(Bai).min(1),
  tongKet: z.object({
    canNam: z.array(z.string().min(1)).min(1),
    apDungBanThan: z.array(z.string().min(1)).min(1),
  }),
})
export type Chuong = z.infer<typeof Chuong>
