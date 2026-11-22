import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gộp class Tailwind, class sau thắng class trước khi trùng nhóm. */
export function cn(...lop: ClassValue[]) {
  return twMerge(clsx(lop))
}
