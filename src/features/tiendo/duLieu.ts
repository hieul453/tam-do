import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, daCauHinhSupabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

/**
 * Tiến độ và cơ chế: XP, chuỗi ngày, tim, mục tiêu hằng ngày.
 *
 * Mọi con số đến từ MỘT lời gọi `so_lieu_hoc()`. Lý do không truy vấn ba bảng
 * rồi tự ghép ở đây: chỉ server biết "hôm nay" theo múi giờ của chính người
 * dùng. Để client tự tính ngày là mở đường cho chuỗi ngày bị mất oan khi máy
 * và database lệch múi giờ.
 *
 * Các hàm ghi cũng trả về số liệu mới, nên sau mỗi lần ghi không cần gọi lại
 * để đọc — đặt thẳng vào cache.
 */

export type Huong = 'nhanh' | 'dao-sau' | 'ap-dung'

export type PhanDaXong = {
  phanId: string
  huong: Huong
  xp: number
  soLan: number
}

export type SoLieuHoc = {
  chuoi: number
  chuoiDaiNhat: number
  tim: number
  xpHomNay: number
  xpTong: number
  mucTieuXpNgay: number
  daHocHomNay: boolean
  daXong: PhanDaXong[]
}

export const TIM_TOI_DA = 5

/** Các mức mục tiêu cho chọn. Server cũng chỉ nhận đúng bốn giá trị này. */
export const MUC_TIEU = [10, 20, 30, 50] as const

/**
 * XP của từng hướng.
 *
 * NHANH tính theo số câu nên nằm ở hàm riêng. ĐÀO SÂU được nhiều hơn ÁP DỤNG
 * vì mất nhiều thời gian hơn — không phải vì nó "giá trị hơn".
 */
export const XP_DAO_SAU = 15
export const XP_AP_DUNG = 10

export function xpPhienNhanh(tongCau: number, soSai: number) {
  return tongCau * 2 + (soSai === 0 ? 5 : 0)
}

const SO_LIEU_RONG: SoLieuHoc = {
  chuoi: 0,
  chuoiDaiNhat: 0,
  tim: TIM_TOI_DA,
  xpHomNay: 0,
  xpTong: 0,
  mucTieuXpNgay: 20,
  daHocHomNay: false,
  daXong: [],
}

const KHOA = 'so-lieu-hoc'

async function goiRpc(ten: string, tham?: Record<string, unknown>): Promise<SoLieuHoc> {
  const { data, error } = await supabase.rpc(ten, tham)
  if (error) throw new Error(error.message)
  return data as SoLieuHoc
}

/**
 * Số liệu học của người đang đăng nhập.
 *
 * `sanSang` nói "đã biết chắc con số là gì" — dùng nó để không hiện số 0 nhấp
 * nháy rồi đổi. Chưa cấu hình Supabase thì sẵn sàng ngay, chỉ là không lưu.
 */
export function useSoLieu() {
  const { session, dangTai } = useAuth()
  const uid = session?.user.id
  const luuDuoc = daCauHinhSupabase && Boolean(uid)

  const truyVan = useQuery({
    queryKey: [KHOA, uid],
    enabled: luuDuoc && !dangTai,
    queryFn: () => goiRpc('so_lieu_hoc'),
  })

  return {
    soLieu: truyVan.data ?? SO_LIEU_RONG,
    sanSang: !luuDuoc || truyVan.isSuccess,
    luuDuoc,
    loi: truyVan.error,
  }
}

/**
 * Khoá của một phần trong database.
 *
 * Ghép cả ba cấp chứ không chỉ id phần: id phần chỉ chắc chắn duy nhất trong
 * một chương, nên khi nội dung lớn lên hai chương có thể trùng id. Sửa sau thì
 * phải chuyển dữ liệu, còn ghép ngay từ đầu thì không mất gì.
 */
export function khoaPhan(idNhanh: string, idChuong: string, idPhan: string) {
  return `${idNhanh}/${idChuong}/${idPhan}`
}

/** Đã học xong hướng này của phần này chưa. */
export function daXongHuong(soLieu: SoLieuHoc, khoa: string, huong: Huong) {
  return soLieu.daXong.some((x) => x.phanId === khoa && x.huong === huong)
}

/** Số hướng đã xong của một phần. */
export function soHuongDaXong(soLieu: SoLieuHoc, khoa: string) {
  return soLieu.daXong.filter((x) => x.phanId === khoa).length
}

/** Phần dùng chung của ba hàm ghi dưới đây. Là hook nên đặt tên `use…`. */
function useChung() {
  const qc = useQueryClient()
  const { session } = useAuth()
  const uid = session?.user.id
  return {
    enabled: daCauHinhSupabase && Boolean(uid),
    luu: (sl: SoLieuHoc) => qc.setQueryData([KHOA, uid], sl),
  }
}

/**
 * Ghi một phiên học.
 *
 * Phiên NHANH gửi SỐ TIM CÒN LẠI chứ không gửi số câu sai: phiên học cho nạp
 * lại tim giữa đường, nên nếu server tự trừ theo số câu sai thì hai bên lệch
 * nhau — người học thấy 5 tim trong bài mà thanh bên hiện 0.
 *
 * Hai hướng còn lại là bài đọc, không ăn tim, nên bỏ trống `timConLai` và
 * server giữ nguyên số tim đang có.
 *
 * Không chặn người học nếu ghi thất bại. Mất một phiên XP là chuyện nhỏ; chặn
 * họ lại giữa lúc đang học là chuyện lớn.
 */
export function useGhiNhanPhien() {
  const { enabled, luu } = useChung()
  return useMutation({
    mutationFn: async (v: { phanId: string; huong: Huong; xp: number; timConLai?: number }) => {
      if (!enabled) return null
      return goiRpc('ghi_nhan_phien', {
        p_phan_id: v.phanId,
        p_huong: v.huong,
        p_xp: v.xp,
        p_tim_con_lai: v.timConLai,
      })
    },
    onSuccess: (sl) => {
      if (sl) luu(sl)
    },
  })
}

/**
 * Ghi một phiên luyện tập.
 *
 * Tách khỏi `useGhiNhanPhien` vì luyện tập trộn câu từ nhiều phần nên không
 * thuộc phần nào — nó chỉ cộng XP và giữ chuỗi ngày.
 */
export function useGhiNhanLuyenTap() {
  const { enabled, luu } = useChung()
  return useMutation({
    mutationFn: async (v: { xp: number; timConLai: number }) => {
      if (!enabled) return null
      return goiRpc('ghi_nhan_luyen_tap', { p_xp: v.xp, p_tim_con_lai: v.timConLai })
    },
    onSuccess: (sl) => {
      if (sl) luu(sl)
    },
  })
}

export function useNapLaiTim() {
  const { enabled, luu } = useChung()
  return useMutation({
    mutationFn: async () => (enabled ? goiRpc('nap_lai_tim') : null),
    onSuccess: (sl) => {
      if (sl) luu(sl)
    },
  })
}

export function useDatMucTieu() {
  const { enabled, luu } = useChung()
  return useMutation({
    mutationFn: async (xp: number) => (enabled ? goiRpc('dat_muc_tieu_ngay', { p_xp: xp }) : null),
    onSuccess: (sl) => {
      if (sl) luu(sl)
    },
  })
}
