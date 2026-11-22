import { Trophy, Flame, Zap, Check, Lock, CalendarDays } from 'lucide-react'
import { The } from '@/components/ui/co-ban'
import { cn } from '@/lib/cn'
import { useSoLieu } from '@/features/tiendo/duLieu'
import { huyHieuCua } from './huyHieu'

/**
 * Thành tích.
 *
 * Bốn con số rồi tới huy hiệu. Huy hiệu chưa đạt vẫn hiện, có ghi điều kiện —
 * Duolingo làm vậy và nó đúng: thấy cái sắp với tới được thì mới có lý do học
 * tiếp, còn giấu đi thì chỉ còn là phần thưởng bất ngờ.
 */
export function TrangThanhTich() {
  const { soLieu, sanSang, luuDuoc } = useSoLieu()
  const so = (n: number) => (sanSang ? n : '–')
  const huyHieu = huyHieuCua(soLieu)
  const soDat = huyHieu.filter((h) => h.dat).length

  const o = [
    { icon: Zap, nhan: 'Tổng XP', giaTri: so(soLieu.xpTong), mau: 'text-nhan-dam' },
    { icon: Flame, nhan: 'Chuỗi dài nhất', giaTri: so(soLieu.chuoiDaiNhat), mau: 'text-vang' },
    { icon: Check, nhan: 'Phiên đã xong', giaTri: so(soLieu.soPhien), mau: 'text-dung' },
    { icon: CalendarDays, nhan: 'Ngày đã học', giaTri: so(soLieu.soNgayHoc), mau: 'text-sau' },
  ]

  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-vua bg-vang-nhat text-vang">
          <Trophy className="size-6" strokeWidth={2.2} aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold">Thành tích</h1>
          <p className="text-sm text-chu-phu">Những gì bạn đã đi qua</p>
        </div>
      </div>

      <ul className="mb-4 grid grid-cols-2 gap-3">
        {o.map(({ icon: Icon, nhan, giaTri, mau }) => (
          <li key={nhan}>
            <The className="text-center">
              <Icon className={cn('mx-auto mb-1.5 size-6', mau)} strokeWidth={2.4} aria-hidden />
              <p className={cn('text-2xl font-extrabold tabular-nums', mau)}>{giaTri}</p>
              <p className="text-[0.7rem] font-bold tracking-wide text-chu-phu uppercase">{nhan}</p>
            </The>
          </li>
        ))}
      </ul>

      {luuDuoc && sanSang && soLieu.xpTong === 0 && (
        <The className="mb-4 bg-nen-dju">
          <p className="text-sm text-chu-phu">
            Chưa có gì ở đây. Làm xong một phần là bốn con số trên bắt đầu chạy.
          </p>
        </The>
      )}

      {!luuDuoc && (
        <p className="mb-4 text-xs text-chu-mo">
          Máy chủ lưu trữ chưa được cấu hình, nên chưa có gì để đếm.
        </p>
      )}

      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-chu-phu uppercase">Huy hiệu</h2>
        <span className="shrink-0 text-xs font-bold tabular-nums text-chu-phu">
          {soDat}/{huyHieu.length}
        </span>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {huyHieu.map((h) => (
          <li key={h.ma}>
            <The
              className={cn(
                'flex h-full items-start gap-3',
                h.dat ? 'border-vang/40 bg-vang-nhat' : 'bg-nen-dju',
              )}
            >
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-full',
                  h.dat ? 'bg-vang text-white' : 'bg-nen text-chu-mo',
                )}
              >
                {h.dat ? (
                  <Trophy className="size-5" strokeWidth={2.4} aria-hidden />
                ) : (
                  <Lock className="size-4" strokeWidth={2.4} aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className={cn('block font-extrabold', !h.dat && 'text-chu-phu')}>
                  {h.ten}
                </span>
                <span className="mt-0.5 block text-sm text-chu-phu">
                  {h.dat ? h.yNghia : h.dieuKien}
                </span>
                <span className="sr-only">{h.dat ? 'đã đạt' : 'chưa đạt'}</span>
              </span>
            </The>
          </li>
        ))}
      </ul>
    </div>
  )
}
