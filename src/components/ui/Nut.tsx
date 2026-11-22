import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Nút khối có "chân" dưới, bấm vào lún xuống.
 *
 * Mượn từ Duolingo và giữ lại vì nó giải quyết một việc thật: trên màn hình
 * cảm ứng không có phản hồi xúc giác, cái lún xuống thay cho cảm giác bấm.
 * Chữ IN HOA và cân nặng đậm cũng từ đó — nút là hành động, không phải văn bản.
 */
type Kieu = 'chinh' | 'phu' | 'vien' | 'tron' | 'nguy'
type Co = 'vua' | 'lon'

const KIEU: Record<Kieu, string> = {
  chinh: 'bg-nhan text-white border-nhan-dam hover:brightness-105',
  phu: 'bg-dung text-white border-[#0f6f45] hover:brightness-105',
  vien: 'bg-nen text-chu-phu border-vien-dam hover:bg-nen-dju',
  tron: 'bg-transparent text-chu-phu border-transparent hover:bg-nen-chim',
  nguy: 'bg-sai text-white border-[#a8343d] hover:brightness-105',
}

const CO: Record<Co, string> = {
  vua: 'px-5 py-2.5 text-sm',
  lon: 'px-6 py-3.5 text-base w-full',
}

export const Nut = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { kieu?: Kieu; co?: Co }
>(function Nut({ kieu = 'chinh', co = 'vua', className, ...rest }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        'nut-khoi inline-flex items-center justify-center gap-2 rounded-vua border-2 font-bold tracking-wide uppercase',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100',
        KIEU[kieu],
        CO[co],
        className,
      )}
      {...rest}
    />
  )
})
