import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Dumbbell, Trophy, Flame, Zap, Heart, Hammer, Check } from 'lucide-react'
import { The, Huy, ThanhTienDo } from '@/components/ui/co-ban'
import { Nut } from '@/components/ui/Nut'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { useSoLieu, useDatMucTieu, MUC_TIEU } from '@/features/tiendo/duLieu'

/**
 * Các tab chưa làm trong M1.
 *
 * Để trống hẳn thì người xem tưởng app hỏng. Mỗi trang nói rõ nó sẽ là gì,
 * nên bản demo vẫn đọc được như một sản phẩm có chủ đích chứ không phải
 * một nửa dở dang.
 */
function Khung({
  icon: Icon,
  tieuDe,
  moTa,
  sePhai,
  sapCo = true,
  children,
}: {
  icon: LucideIcon
  tieuDe: string
  moTa: string
  sePhai: string[]
  /** Trang đã có nội dung thật thì bỏ nhãn "Sắp có" đi, đừng nói sai. */
  sapCo?: boolean
  children?: ReactNode
}) {
  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-vua bg-nen-chim text-chu-phu">
          <Icon className="size-6" strokeWidth={2.2} aria-hidden />
        </span>
        <div className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold">{tieuDe}</h1>
            {sapCo && <Huy>Sắp có</Huy>}
          </span>
          <p className="text-sm text-chu-phu">{moTa}</p>
        </div>
      </div>

      {children}

      <The className="bg-nen-dju">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-chu-phu">
          <Hammer className="size-4" aria-hidden />
          Phần này sẽ có
        </p>
        <ul className="flex flex-col gap-2 text-sm text-chu-phu">
          {sePhai.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="text-chu-mo" aria-hidden>
                •
              </span>
              {x}
            </li>
          ))}
        </ul>
      </The>
    </div>
  )
}

export function TrangLuyenTap() {
  return (
    <Khung
      icon={Dumbbell}
      tieuDe="Luyện tập"
      moTa="Ôn lại những gì sắp quên, trước khi quên thật"
      sePhai={[
        'Ôn giãn cách: thẻ nào sắp rơi khỏi trí nhớ thì nổi lên trước',
        'Luyện nhanh 5 phút, gom các phần đã học',
        'Luyện riêng những câu từng trả lời sai',
      ]}
    />
  )
}

export function TrangThanhTich() {
  const { soLieu, sanSang, luuDuoc } = useSoLieu()
  const so = (n: number) => (sanSang ? n : '–')

  const o = [
    { icon: Zap, nhan: 'Tổng XP', giaTri: so(soLieu.xpTong), mau: 'text-nhan-dam' },
    { icon: Flame, nhan: 'Chuỗi hiện tại', giaTri: so(soLieu.chuoi), mau: 'text-vang' },
    { icon: Trophy, nhan: 'Chuỗi dài nhất', giaTri: so(soLieu.chuoiDaiNhat), mau: 'text-vang' },
    { icon: Check, nhan: 'Lượt học đã xong', giaTri: so(soLieu.daXong.length), mau: 'text-dung' },
  ]

  return (
    <Khung
      icon={Trophy}
      tieuDe="Thành tích"
      moTa="Những gì bạn đã đi qua"
      sapCo={false}
      sePhai={[
        'Huy hiệu theo cột mốc thật, không phải điểm cho vui',
        'Biểu đồ XP theo tuần, thấy được tuần nào mình đi chậm lại',
        'Số khái niệm đã giải thích được bằng lời của mình',
      ]}
    >
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

      {!luuDuoc && (
        <p className="mb-4 text-xs text-chu-mo">
          Máy chủ lưu trữ chưa được cấu hình, nên chưa có gì để đếm.
        </p>
      )}
    </Khung>
  )
}

export function TrangToi() {
  const { session, laAnDanh, dangTai, lienKetGoogle, dangXuat } = useAuth()
  const { soLieu, sanSang, luuDuoc } = useSoLieu()
  const datMucTieu = useDatMucTieu()
  const xongMucTieu = soLieu.xpHomNay >= soLieu.mucTieuXpNgay

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold">Tôi</h1>

      <The className="mb-4">
        <h2 className="mb-3 text-sm font-bold">Tài khoản</h2>
        {dangTai ? (
          <p className="text-sm text-chu-phu">Đang tải…</p>
        ) : laAnDanh ? (
          <>
            <p className="mb-3 text-sm text-chu-phu">
              Bạn đang học ẩn danh. Liên kết Google để giữ tiến độ khi đổi máy — mã người dùng không
              đổi nên không mất gì.
            </p>
            <Nut kieu="vien" co="lon" onClick={() => void lienKetGoogle()}>
              Liên kết tài khoản Google
            </Nut>
          </>
        ) : (
          <>
            <p className="mb-3 text-sm text-chu-phu">{session?.user.email ?? 'Đã liên kết'}</p>
            <Nut kieu="tron" co="lon" onClick={() => void dangXuat()}>
              Đăng xuất
            </Nut>
          </>
        )}
      </The>

      <The className="mb-4">
        <h2 className="mb-3 text-sm font-bold">Hôm nay</h2>
        <div className="mb-4 flex items-center justify-between text-sm">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 font-bold',
              soLieu.chuoi > 0 ? 'text-vang' : 'text-chu-mo',
            )}
          >
            <Flame className={cn('size-4', soLieu.chuoi > 0 && 'fill-vang')} aria-hidden />
            {sanSang ? soLieu.chuoi : '–'} ngày
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-nhan-dam">
            <Zap className="size-4" aria-hidden /> {sanSang ? soLieu.xpHomNay : '–'} XP
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 font-bold',
              soLieu.tim > 0 ? 'text-sai' : 'text-chu-mo',
            )}
          >
            <Heart className={cn('size-4', soLieu.tim > 0 && 'fill-sai')} aria-hidden />
            {sanSang ? soLieu.tim : '–'}
          </span>
        </div>
        <ThanhTienDo
          giaTri={soLieu.xpHomNay}
          tong={soLieu.mucTieuXpNgay}
          mau={xongMucTieu ? 'dung' : 'nhan'}
          nhan="tiến độ mục tiêu hôm nay"
        />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-chu-phu">
          {xongMucTieu && <Check className="size-3.5 text-dung" strokeWidth={3} aria-hidden />}
          {soLieu.xpHomNay} / {soLieu.mucTieuXpNgay} XP
          {soLieu.chuoiDaiNhat > 0 && (
            <span className="text-chu-mo">· chuỗi dài nhất {soLieu.chuoiDaiNhat} ngày</span>
          )}
        </p>
      </The>

      <The className="mb-4">
        <h2 className="mb-1 text-sm font-bold">Mục tiêu mỗi ngày</h2>
        <p className="mb-3 text-sm text-chu-phu">
          Chọn mức giữ được đều, không phải mức cao nhất. Đều đặn mới thành chuỗi.
        </p>
        <div className="flex flex-wrap gap-2">
          {MUC_TIEU.map((xp) => {
            const dangChon = soLieu.mucTieuXpNgay === xp
            return (
              <button
                key={xp}
                type="button"
                disabled={!luuDuoc || datMucTieu.isPending}
                onClick={() => datMucTieu.mutate(xp)}
                aria-pressed={dangChon}
                className={cn(
                  'min-h-11 rounded-vua border-2 px-4 text-sm font-bold transition-colors disabled:opacity-50',
                  dangChon
                    ? 'border-nhan bg-nhan-nhat text-nhan-dam'
                    : 'border-vien text-chu-phu hover:bg-nen-dju',
                )}
              >
                {xp} XP
              </button>
            )
          })}
        </div>
        {!luuDuoc && (
          <p className="mt-3 text-xs text-chu-mo">
            Máy chủ lưu trữ chưa được cấu hình, nên chưa đổi được mục tiêu.
          </p>
        )}
      </The>

      <p className="text-center text-xs leading-relaxed text-chu-mo">
        Bản đang chạy <span className="font-mono">{__MA_BUILD__}</span>
        <br />
        Tâm Đồ là công cụ học tập, không thay thế chẩn đoán hay trị liệu.
      </p>
    </div>
  )
}
