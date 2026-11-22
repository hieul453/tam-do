import { useEffect, useRef, useState } from 'react'
import { useSoLieu, useGhiNhanPhien, daXongHuong, type Huong } from './duLieu'

/**
 * Ghi nhận một hướng "đọc" (ĐÀO SÂU, ÁP DỤNG) khi người học xuống tới cuối trang.
 *
 * Tại sao không gắn vào nút "Xong": nút đó bấm được ngay giây đầu. Nếu lộ
 * trình hiện dấu tích cho một bài chưa ai đọc thì con số mất nghĩa, mà mất
 * nghĩa thì nó chỉ còn là trang trí. Cái mốc ở cuối bài chỉ chạm tới được khi
 * đã cuộn qua hết — vừa đơn giản vừa trung thực.
 *
 * `daXong` chỉ bật khi database ĐÃ xác nhận, không bật lúc vừa nhìn thấy mốc.
 * Bản đầu làm ngược lại và nó nói dối: lời gọi hỏng vì sai tham số, màn hình
 * vẫn báo "+15 XP", mà lộ trình thì không nhúc nhích. Thà chậm nửa giây còn
 * hơn hiện một con số không có thật.
 */
export function useGhiKhiDenCuoi({
  phanId,
  huong,
  xp,
  san,
}: {
  phanId: string
  huong: Huong
  xp: number
  /** Nội dung đã dựng xong chưa — chưa thì chưa quan sát. */
  san: boolean
}) {
  const { soLieu, sanSang, luuDuoc } = useSoLieu()
  const ghiNhan = useGhiNhanPhien()
  const daCoTruoc = daXongHuong(soLieu, phanId, huong)

  // Cờ "đã bấm cò", để không gọi lại; khác với "đã ghi xong".
  const [daGoi, setDaGoi] = useState(false)
  const moc = useRef<HTMLDivElement | null>(null)

  // `ghiNhan` là object mới mỗi lần render nên không đưa vào danh sách phụ
  // thuộc; giữ trong ref để effect chỉ chạy lại khi điều kiện thật sự đổi.
  const goi = useRef(ghiNhan.mutate)
  goi.current = ghiNhan.mutate

  useEffect(() => {
    // Đã đọc xong rồi thì thôi. Khác phiên NHANH: làm lại bài tập là công sức
    // thật nên vẫn được XP, còn mở lại bài đọc và cuộn xuống đáy thì không —
    // không thì chỉ cần bấm tải lại là có điểm.
    if (!san || !luuDuoc || !sanSang || daGoi || daCoTruoc) return
    const el = moc.current
    if (!el) return

    const theoDoi = new IntersectionObserver((muc) => {
      if (!muc.some((m) => m.isIntersecting)) return
      theoDoi.disconnect()
      setDaGoi(true)
      // Không gửi timConLai: bài đọc không ăn tim.
      goi.current({ phanId, huong, xp })
    })

    theoDoi.observe(el)
    return () => theoDoi.disconnect()
  }, [san, luuDuoc, sanSang, daGoi, daCoTruoc, phanId, huong, xp])

  return {
    moc,
    daXong: daCoTruoc || Boolean(ghiNhan.data),
    dangGhi: ghiNhan.isPending,
    ghiHong: ghiNhan.isError,
  }
}
