import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { X, Heart, Check, Info, RotateCcw } from 'lucide-react'
import type { BaiTap } from '@/content/schema'
import { Nut } from '@/components/ui/Nut'
import { ThanhTienDo } from '@/components/ui/co-ban'
import { cn } from '@/lib/cn'
import { useSoLieu, useNapLaiTim, xpPhienNhanh, TIM_TOI_DA } from '@/features/tiendo/duLieu'
import { phatAm } from '@/lib/am-thanh'
import { RenderBaiTap, kiemTra, cauHoiCua, type TraLoi } from './baiTap'

/**
 * Bộ chơi một phiên hỏi đáp. Dùng chung cho phiên NHANH của một phần và cho
 * trang Luyện tập — hai nơi khác nhau ở chỗ lấy câu hỏi từ đâu và ghi kết quả
 * vào đâu, còn cách chơi thì phải giống hệt nhau, nếu không người học phải
 * học lại giao diện.
 *
 * Ba thứ mượn thẳng từ Duolingo vì chúng giải quyết vấn đề thật:
 *
 *   · Thanh tiến độ trên cùng — người học luôn biết còn bao xa, nên không bỏ giữa chừng.
 *   · Nút Kiểm tra khoá cho tới khi chọn gì đó — mỗi màn hình đúng một quyết định.
 *   · Câu sai bị xếp lại cuối hàng đợi — không cho đi tiếp khi chưa thật sự nắm.
 *
 * Khác họ một chỗ: hết tim thì mời nạp lại miễn phí chứ không chặn. Chặn là cơ
 * chế kiếm tiền của Duolingo, không phải cơ chế học.
 */

export type KetQuaPhien = {
  tongCau: number
  soSai: number
  timConLai: number
  xp: number
}

export function PhienHoc({
  baiTap,
  duongDanThoat,
  khiXong,
}: {
  baiTap: BaiTap[]
  /** Bấm X hoặc bỏ giữa chừng thì về đâu. */
  duongDanThoat: string
  /** Gọi đúng một lần, ngay trong lần bấm cuối của người học. */
  khiXong: (kq: KetQuaPhien) => void
}) {
  const navigate = useNavigate()
  const { soLieu, sanSang } = useSoLieu()
  const napLai = useNapLaiTim()

  const [hangDoi, setHangDoi] = useState<BaiTap[]>(baiTap)
  const [chiSo, setChiSo] = useState(0)
  const [traLoi, setTraLoi] = useState<TraLoi>(null)
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null)
  // null = chưa biết người này còn mấy tim. Lấy từ hồ sơ, không mặc định 5:
  // nếu không, người vừa hết tim mở bài mới lại thấy đầy tim.
  const [tim, setTim] = useState<number | null>(null)
  const [daXong, setDaXong] = useState<Set<string>>(new Set())
  const [soSai, setSoSai] = useState(0)
  const [hoiThoat, setHoiThoat] = useState(false)

  const datTraLoi = useCallback((t: TraLoi) => setTraLoi(t), [])
  const oCauHoi = useRef<HTMLHeadingElement>(null)

  // Đồng bộ một lần lúc vào bài. Sau đó tim do phiên học tự quản, và chỉ chốt
  // lại xuống database khi phiên kết thúc.
  useEffect(() => {
    setTim((cu) => (cu === null && sanSang ? soLieu.tim : cu))
  }, [sanSang, soLieu.tim])

  // Sang câu mới thì đưa tiêu điểm về câu hỏi.
  //
  // Không làm thì sau mỗi lần bấm "Tiếp tục", tiêu điểm rơi về đầu trang:
  // người dùng bàn phím phải Tab lại từ đầu mỗi câu, còn trình đọc màn hình
  // thì đọc lại cả thanh trên thay vì đọc câu hỏi mới.
  // `daVao` chỉ lật một lần, lúc biết được số tim và câu hỏi đầu tiên hiện
  // ra. Để `tim` thẳng vào danh sách phụ thuộc thì mỗi lần trả lời sai, tiêu
  // điểm lại bị giật khỏi nút Tiếp tục về tiêu đề.
  const daVao = tim !== null
  useEffect(() => {
    if (daVao) oCauHoi.current?.focus()
  }, [chiSo, daVao])

  // Chờ biết số tim thật trước khi vào câu đầu: vào trước rồi sửa số sau là
  // người học thấy tim nhảy, tưởng mình vừa mất một cái.
  if (tim === null) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <p className="text-sm text-chu-phu">Đang mở bài…</p>
      </div>
    )
  }

  const bt = hangDoi[chiSo]
  const laTheDay = bt.loai === 'the-lat'
  const chuaTraLoi = traLoi === null
  const tienDo = daXong.size

  function bamKiemTra() {
    const dung = kiemTra(bt, traLoi)
    if (laTheDay) {
      phatAm('cham')
      sangCauSau(true)
      return
    }
    setKetQua(dung ? 'dung' : 'sai')
    phatAm(dung ? 'dung' : 'sai')
    if (!dung) {
      setSoSai((n) => n + 1)
      setTim((t) => Math.max(0, (t ?? TIM_TOI_DA) - 1))
      // Xếp lại cuối hàng đợi: chưa nắm thì chưa cho qua.
      setHangDoi((h) => [...h, bt])
    } else {
      setDaXong((s) => new Set(s).add(bt.id))
    }
  }

  function sangCauSau(danhDauXong = false) {
    if (danhDauXong) setDaXong((s) => new Set(s).add(bt.id))
    setKetQua(null)
    setTraLoi(null)
    if (chiSo + 1 >= hangDoi.length) {
      phatAm('xong')
      // Chốt ngay trong lần bấm của người học, không để useEffect của màn tổng
      // kết làm — effect chạy hai lần ở StrictMode, và một phiên bị ghi hai lần
      // là XP đôi.
      khiXong({
        tongCau: baiTap.length,
        soSai,
        timConLai: tim ?? TIM_TOI_DA,
        xp: xpPhienNhanh(baiTap.length, soSai),
      })
    } else {
      setChiSo((i) => i + 1)
    }
  }

  const hetTim = tim === 0 && ketQua === 'sai'

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Thanh trên: thoát · tiến độ · tim */}
      <header className="flex items-center gap-4 px-4 py-4 lg:px-8">
        <button
          onClick={() => setHoiThoat(true)}
          className="shrink-0 text-chu-mo hover:text-chu"
          aria-label="Thoát phiên học"
        >
          <X className="size-6" strokeWidth={2.5} />
        </button>
        <ThanhTienDo
          giaTri={tienDo}
          tong={baiTap.length}
          mau="nhan"
          nhan={`đã xong ${tienDo} trên ${baiTap.length} câu`}
        />
        <span className="flex shrink-0 items-center gap-1.5 font-bold text-sai" title="tim còn lại">
          <Heart className={cn('size-5', tim > 0 && 'fill-sai')} aria-hidden />
          <span className="tabular-nums">{tim}</span>
        </span>
      </header>

      {/* Bài tập */}
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-4 lg:py-10">
        {/* tabIndex -1: nhận được tiêu điểm bằng mã, nhưng không chen vào
            thứ tự Tab của người dùng. */}
        <h1
          ref={oCauHoi}
          tabIndex={-1}
          className="mb-6 text-xl font-extrabold focus:outline-none lg:text-2xl"
        >
          {cauHoiCua(bt)}
        </h1>
        <RenderBaiTap bt={bt} traLoi={traLoi} datTraLoi={datTraLoi} daKhoa={ketQua !== null} />
      </main>

      {/* Thanh dưới: Kiểm tra, hoặc tấm phản hồi */}
      <footer
        className={cn(
          'border-t-2 transition-colors',
          ketQua === 'dung'
            ? 'border-dung/20 bg-dung-nhat'
            : ketQua === 'sai'
              ? 'border-sai/20 bg-sai-nhat'
              : 'border-vien bg-nen',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto w-full max-w-xl px-4 py-4 lg:py-5">
          {/* role=status: trình đọc màn hình đọc "Chính xác" / "Chưa đúng"
              ngay khi nó hiện ra, không cần người dùng đi tìm. */}
          {ketQua && (
            <div
              key={`${chiSo}-${ketQua}`}
              role="status"
              className="hien-len mb-4 flex items-start gap-3"
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-full bg-nen',
                  ketQua === 'dung' ? 'text-dung' : 'text-sai',
                )}
              >
                {ketQua === 'dung' ? (
                  <Check className="size-5" strokeWidth={3} aria-hidden />
                ) : (
                  <X className="size-5" strokeWidth={3} aria-hidden />
                )}
              </span>
              <div className="min-w-0">
                <p className={cn('font-extrabold', ketQua === 'dung' ? 'text-dung' : 'text-sai')}>
                  {ketQua === 'dung' ? 'Chính xác' : 'Chưa đúng'}
                </p>
                {bt.giaiThich && (
                  <p className={cn('text-sm', ketQua === 'dung' ? 'text-dung/90' : 'text-sai/90')}>
                    {bt.giaiThich}
                  </p>
                )}
                {ketQua === 'sai' && (
                  <p className="mt-1 text-xs font-bold tracking-wide text-sai/80 uppercase">
                    Câu này sẽ quay lại ở cuối
                  </p>
                )}
              </div>
            </div>
          )}

          {hetTim ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Nut kieu="vien" co="lon" onClick={() => navigate(duongDanThoat)}>
                Để sau
              </Nut>
              <Nut
                co="lon"
                onClick={() => {
                  setTim(TIM_TOI_DA)
                  // Ghi luôn, để con số ở thanh bên khớp với con số trong bài.
                  napLai.mutate()
                  sangCauSau()
                }}
              >
                <RotateCcw className="size-4" aria-hidden />
                Nạp lại tim
              </Nut>
            </div>
          ) : ketQua ? (
            <Nut co="lon" kieu={ketQua === 'dung' ? 'phu' : 'nguy'} onClick={() => sangCauSau()}>
              Tiếp tục
            </Nut>
          ) : (
            <Nut co="lon" disabled={chuaTraLoi} onClick={bamKiemTra}>
              {laTheDay ? 'Tiếp tục' : 'Kiểm tra'}
            </Nut>
          )}
        </div>
      </footer>

      {/* Hỏi trước khi thoát — mất tiến độ là mất thật */}
      {hoiThoat && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-chu/40 p-6">
          <div className="w-full max-w-sm rounded-lon border border-vien bg-nen p-6 text-center shadow-noi">
            <Info className="mx-auto mb-3 size-10 text-nhan-dam" aria-hidden />
            <h2 className="text-lg font-extrabold">Thoát bây giờ?</h2>
            <p className="mt-1 mb-5 text-sm text-chu-phu">
              Tiến độ của phiên này sẽ không được lưu.
            </p>
            <div className="flex flex-col gap-2.5">
              <Nut co="lon" onClick={() => setHoiThoat(false)}>
                Học tiếp
              </Nut>
              <Nut kieu="tron" co="lon" onClick={() => navigate(duongDanThoat)}>
                Thoát
              </Nut>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
