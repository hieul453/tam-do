import { useNavigate } from 'react-router'
import { Zap, Target, Heart, PartyPopper } from 'lucide-react'
import { Nut } from '@/components/ui/Nut'
import { cn } from '@/lib/cn'

/**
 * Màn tổng kết phiên.
 *
 * Duolingo đặt màn này ngay sau mỗi bài và đó là lý do người ta học tiếp: nỗ
 * lực vừa bỏ ra được quy thành con số nhìn thấy được. Ba ô là đủ — thêm nữa
 * thì không ai đọc.
 *
 * XP tính thật từ kết quả, nhưng chưa lưu xuống database; phần đó ở M3.
 */
export function ManTongKet({
  tongCau,
  soSai,
  timConLai,
  tenPhan,
  duongDanPhan,
}: {
  tongCau: number
  soSai: number
  timConLai: number
  tenPhan: string
  duongDanPhan: string
}) {
  const navigate = useNavigate()
  const doChinhXac =
    tongCau > 0 ? Math.round(((tongCau - Math.min(soSai, tongCau)) / tongCau) * 100) : 0
  const xp = tongCau * 2 + (soSai === 0 ? 5 : 0)

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
