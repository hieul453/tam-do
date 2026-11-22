import { useNavigate } from 'react-router'
import { Zap, Target, Heart, PartyPopper, Flame, CloudOff, Check } from 'lucide-react'
import { Nut } from '@/components/ui/Nut'
import { ThanhTienDo } from '@/components/ui/co-ban'
import { cn } from '@/lib/cn'
import { useSoLieu } from '@/features/tiendo/duLieu'

/**
 * Màn tổng kết phiên.
 *
 * Duolingo đặt màn này ngay sau mỗi bài và đó là lý do người ta học tiếp: nỗ
 * lực vừa bỏ ra được quy thành con số nhìn thấy được. Ba ô là đủ — thêm nữa
 * thì không ai đọc.
 *
 * Dưới ba ô là hai thứ nối phiên này với đường dài: chuỗi ngày và mục tiêu hôm
 * nay. Chúng đọc từ số liệu đã lưu, nên nếu màn này hiện 5 ngày thì database
 * cũng đang nói 5 ngày.
 */
export function ManTongKet({
  tongCau,
  soSai,
  timConLai,
  xp,
  tenPhan,
  duongDanPhan,
  dangLuu,
  luuThatBai,
}: {
  tongCau: number
  soSai: number
  timConLai: number
  xp: number
  tenPhan: string
  duongDanPhan: string
  dangLuu?: boolean
  luuThatBai?: boolean
}) {
  const navigate = useNavigate()
  const { soLieu, luuDuoc } = useSoLieu()
  const doChinhXac =
    tongCau > 0 ? Math.round(((tongCau - Math.min(soSai, tongCau)) / tongCau) * 100) : 0
  const datMucTieu = soLieu.xpHomNay >= soLieu.mucTieuXpNgay

  const o = [
    {
      icon: Zap,
      nhan: 'Điểm nhận được',
      giaTri: `${xp} XP`,
      mau: 'text-nhan-dam',
      nen: 'bg-nhan-nhat',
    },
    {
      icon: Target,
      nhan: 'Độ chính xác',
      giaTri: `${doChinhXac}%`,
      mau: 'text-dung',
      nen: 'bg-dung-nhat',
    },
    {
      icon: Heart,
      nhan: 'Tim còn lại',
      giaTri: String(timConLai),
      mau: 'text-sai',
      nen: 'bg-sai-nhat',
    },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
        <PartyPopper className="mb-4 size-14 text-nhan" strokeWidth={1.8} aria-hidden />
        <h1 className="text-2xl font-extrabold lg:text-3xl">Xong phần này</h1>
        <p className="mt-1 mb-8 text-chu-phu">{tenPhan}</p>

        <ul className="grid w-full grid-cols-3 gap-3">
          {o.map(({ icon: Icon, nhan, giaTri, mau, nen }) => (
            <li key={nhan} className={cn('rounded-lon p-4', nen)}>
              <Icon className={cn('mx-auto mb-1.5 size-6', mau)} strokeWidth={2.4} aria-hidden />
              <p className={cn('text-lg font-extrabold tabular-nums', mau)}>{giaTri}</p>
              <p className="text-[0.7rem] font-bold tracking-wide text-chu-phu uppercase">{nhan}</p>
            </li>
          ))}
        </ul>

        {soSai === 0 && (
          <p className="mt-5 text-sm font-bold text-dung">Không sai câu nào — thưởng thêm 5 XP</p>
        )}

        {luuDuoc && (
          <div className="mt-8 w-full text-left">
            {soLieu.chuoi > 0 && (
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-vang">
                <Flame className="size-5 fill-vang" aria-hidden />
                Chuỗi {soLieu.chuoi} ngày
                {soLieu.chuoi === soLieu.chuoiDaiNhat && soLieu.chuoi > 1 && (
                  <span className="font-normal text-chu-phu">— dài nhất của bạn</span>
                )}
              </p>
            )}

            <p className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-bold">
                Mục tiêu hôm nay
                {datMucTieu && <Check className="size-4 text-dung" strokeWidth={3} aria-hidden />}
              </span>
              <span className="tabular-nums text-chu-phu">
                {soLieu.xpHomNay} / {soLieu.mucTieuXpNgay} XP
              </span>
            </p>
            <ThanhTienDo
              giaTri={soLieu.xpHomNay}
              tong={soLieu.mucTieuXpNgay}
              mau={datMucTieu ? 'dung' : 'nhan'}
              nhan="tiến độ mục tiêu hôm nay"
            />
          </div>
        )}

        {dangLuu && <p className="mt-4 text-xs text-chu-mo">Đang lưu tiến độ…</p>}
        {luuThatBai && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-chu-phu">
            <CloudOff className="size-4 shrink-0" aria-hidden />
            Chưa lưu được tiến độ của phiên này. Bài học thì vẫn là của bạn.
          </p>
        )}
      </main>

      <footer
        className="border-t border-vien"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2.5 px-4 py-4 sm:flex-row">
          <Nut kieu="vien" co="lon" onClick={() => navigate('/')}>
            Về lộ trình
          </Nut>
          <Nut co="lon" onClick={() => navigate(duongDanPhan)}>
            Học sâu hơn phần này
          </Nut>
        </div>
      </footer>
    </div>
  )
}
