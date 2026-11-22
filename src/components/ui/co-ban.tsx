import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Những mảnh nhỏ dùng khắp app. Gom một file vì mỗi cái chỉ vài dòng —
 * tách ra sáu file chỉ làm người đọc phải nhảy qua lại.
 */

/** Khối có viền mảnh. Minimalism: viền thay bóng đổ. */
export function The({
  children,
  className,
  nhan,
}: {
  children: ReactNode
  className?: string
  nhan?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lon border bg-nen p-5',
        nhan ? 'border-nhan/35 bg-nhan-nhat' : 'border-vien',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Nhãn nhỏ: trạng thái, phân loại. Chữ nhỏ, in hoa, không viền. */
export function Huy({
  children,
  mau = 'xam',
  className,
}: {
  children: ReactNode
  mau?: 'xam' | 'nhan' | 'dung' | 'sau' | 'vang'
  className?: string
}) {
  const MAU = {
    xam: 'bg-nen-chim text-chu-phu',
    nhan: 'bg-nhan-nhat text-nhan-dam',
    dung: 'bg-dung-nhat text-dung',
    sau: 'bg-sau-nhat text-sau',
    vang: 'bg-vang-nhat text-vang',
  } as const
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-bold tracking-wide uppercase',
        MAU[mau],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Thanh tiến độ ngang. Dùng ở đầu phiên học và ở thẻ chương. */
export function ThanhTienDo({
  giaTri,
  tong,
  mau = 'dung',
  className,
  nhan,
}: {
  giaTri: number
  tong: number
  mau?: 'dung' | 'nhan'
  className?: string
  nhan?: string
}) {
  const phanTram = tong > 0 ? Math.min(100, Math.round((giaTri / tong) * 100)) : 0
  return (
    <div
      className={cn('h-3 w-full overflow-hidden rounded-full bg-nen-chim', className)}
      role="progressbar"
      aria-valuenow={giaTri}
      aria-valuemin={0}
      aria-valuemax={tong}
      aria-label={nhan ?? `${giaTri} trên ${tong}`}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          mau === 'dung' ? 'bg-dung' : 'bg-nhan',
        )}
        style={{ width: `${phanTram}%` }}
      />
    </div>
  )
}

/** Dòng số liệu nhỏ ở thanh trên cùng: streak, tim, XP. */
export function ChiSo({
  icon,
  giaTri,
  nhan,
  mau = 'text-chu-phu',
}: {
  icon: ReactNode
  giaTri: ReactNode
  nhan: string
  mau?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-bold', mau)} title={nhan}>
      <span aria-hidden>{icon}</span>
      <span className="text-sm tabular-nums">{giaTri}</span>
      <span className="sr-only">{nhan}</span>
    </span>
  )
}
