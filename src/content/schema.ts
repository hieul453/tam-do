import { z } from 'zod'

/**
 * Mô hình nội dung của Tâm Đồ.
 *
 * Bốn tầng, mượn cấu trúc đã được Duolingo chứng minh là chạy được:
 *
 *   Nhánh   (= Section)  Tâm lý học nhận thức, Tâm lý học xã hội…
 *     Chương (= Unit)    Trí nhớ, Chú ý…
 *       Phần (= Node)    một chặng trên lộ trình
 *         3 hướng tiếp cận: NHANH · ĐÀO SÂU · ÁP DỤNG
 *
 * Khác Duolingo ở chỗ: một node của họ là một bài; một Phần của mình chứa
 * ba cách học CÙNG một nội dung. Người vội lấy NHANH, người muốn chắc lấy
 * ĐÀO SÂU, người muốn dùng được ngay lấy ÁP DỤNG.
 *
 * Nội dung nằm trong `du-lieu/*.ts`, không trong database — sửa file là xong,
 * có history git, và sai kiểu thì `npm run typecheck` báo ngay.
 */

export const TrangThai = z.enum([
  'mo', // học được
  'sap-co', // đã có chỗ trên lộ trình, chưa có nội dung
  'khoa', // phải xong phần trước mới mở
])
export type TrangThai = z.infer<typeof TrangThai>

/* ─────────────────────────── NHANH: các loại bài tập ────────────────────── */

const Chung = { id: z.string(), giaiThich: z.string().optional() }

export const BaiTap = z.discriminatedUnion('loai', [
  /** Thẻ lật: mặt trước một khái niệm, mặt sau lời giải thích ngắn. */
  z.object({
    ...Chung,
    loai: z.literal('the-lat'),
    mat_truoc: z.string(),
    mat_sau: z.string(),
  }),
  /** Chọn một đáp án đúng trong nhiều lựa chọn. */
  z.object({
    ...Chung,
    loai: z.literal('chon-mot'),
    cauHoi: z.string(),
    luaChon: z.array(z.string()).min(2).max(4),
    dapAn: z.number().int().min(0),
  }),
  /** Đúng hay sai — nhanh, hợp để đập vỡ hiểu lầm phổ biến. */
  z.object({
    ...Chung,
    loai: z.literal('dung-sai'),
    menhDe: z.string(),
    dung: z.boolean(),
  }),
  /** Ghép cặp: khái niệm ↔ ví dụ đời thường. */
  z.object({
    ...Chung,
    loai: z.literal('ghep-doi'),
    cauHoi: z.string(),
    cap: z.array(z.object({ trai: z.string(), phai: z.string() })).min(3).max(5),
  }),
  /** Điền từ còn thiếu bằng cách chạm vào từ cho sẵn. */
  z.object({
    ...Chung,
    loai: z.literal('dien-tu'),
    cauTruoc: z.string(),
    cauSau: z.string(),
    dapAn: z.string(),
    nhieu: z.array(z.string()).min(1),
  }),
  /** Xếp đúng thứ tự — hợp với quy trình, giai đoạn. */
  z.object({
    ...Chung,
    loai: z.literal('xep-thu-tu'),
    cauHoi: z.string(),
    dungThuTu: z.array(z.string()).min(3).max(5),
  }),
])
export type BaiTap = z.infer<typeof BaiTap>
export type LoaiBaiTap = BaiTap['loai']

/* ──────────────────────────── ĐÀO SÂU ───────────────────────────────────── */

export const Nguon = z.object({
  tenNgan: z.string(),
  moTa: z.string(),
  url: z.string().url().optional(),
})
export type Nguon = z.infer<typeof Nguon>

export const Khoi = z.discriminatedUnion('loai', [
  z.object({ loai: z.literal('doan'), noiDung: z.string() }),
  z.object({ loai: z.literal('tieuDe'), noiDung: z.string() }),
  /** Câu chuyện nghiên cứu: bối cảnh → làm gì → phát hiện → "Nghĩa là". */
  z.object({
    loai: z.literal('nghienCuu'),
    tieuDe: z.string(),
    than: z.string(),
    nghiaLa: z.string(),
    nguon: z.string().optional(),
  }),
  /** Hộp cảnh báo kiến thức đã lỗi thời hoặc hay bị hiểu nhầm. */
  z.object({ loai: z.literal('luuY'), tieuDe: z.string(), noiDung: z.string() }),
  z.object({
    loai: z.literal('bang'),
    cot: z.array(z.string()),
    hang: z.array(z.array(z.string())),
  }),
])
export type Khoi = z.infer<typeof Khoi>

export const DaoSau = z.object({
  phutDoc: z.number().int().positive(),
  tomTat: z.string(),
  khoi: z.array(Khoi).min(1),
  ghiNho: z.array(z.string()).min(2).max(4),
  thuatNgu: z.array(z.object({ vi: z.string(), en: z.string() })),
  nguon: z.array(Nguon).min(1),
})
export type DaoSau = z.infer<typeof DaoSau>

/* ──────────────────────────── ÁP DỤNG ───────────────────────────────────── */

export const ApDung = z.object({
  /** Việc làm được ngay hôm nay, không cần chuẩn bị. */
  lamNgay: z.array(z.object({ tieuDe: z.string(), moTa: z.string() })).min(2),
  /** Thử thách nhiều ngày, ghi lại kết quả. */
  thuThach: z.object({ soNgay: z.number().int().positive(), tieuDe: z.string(), moTa: z.string() }),
  /** Bối cảnh đưa cho AI để nó tư vấn đúng kiến thức của phần này. */
  boiCanhAI: z.string(),
  /** Gợi ý mẫu để người dùng không phải đối mặt ô nhập trống. */
  viDuTinhHuong: z.array(z.string()).min(2),
  /** Chỉ có ở phần đụng tới sức khỏe tâm thần. */
  khiNaoTimChuyenGia: z.string().optional(),
})
export type ApDung = z.infer<typeof ApDung>

/* ──────────────────────────── Cấu trúc ──────────────────────────────────── */

export const Phan = z.object({
  id: z.string(),
  tieuDe: z.string(),
  moTa: z.string(),
  trangThai: TrangThai,
  nhanh: z.array(BaiTap).min(3).optional(),
  daoSau: DaoSau.optional(),
  apDung: ApDung.optional(),
})
export type Phan = z.infer<typeof Phan>

export const Chuong = z.object({
  id: z.string(),
  tieuDe: z.string(),
  cauHoi: z.string(),
  trangThai: TrangThai,
  phan: z.array(Phan),
})
export type Chuong = z.infer<typeof Chuong>

export const Nhanh = z.object({
  id: z.string(),
  tieuDe: z.string(),
  moTa: z.string(),
  /** Tên icon của lucide-react. Giữ bộ icon một nguồn, không trộn emoji. */
  icon: z.string(),
  trangThai: TrangThai,
  chuong: z.array(Chuong),
})
export type Nhanh = z.infer<typeof Nhanh>
