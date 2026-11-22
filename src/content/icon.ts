import { Baby, Brain, Circle, Fingerprint, Flame, HeartPulse, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Icon của các nhánh, liệt kê tên một.
 *
 * Trước đây màn lộ trình tra icon bằng `import * as Icons from 'lucide-react'`
 * rồi lấy theo tên. Cách đó gọn khi viết nhưng kéo **toàn bộ** thư viện vào
 * bundle — khoảng 1500 icon cho sáu cái đang dùng. Đo thật: bỏ nó đi, bản
 * production nhẹ đi hơn một nửa.
 *
 * Cái giá là thêm một nhánh thì phải thêm một dòng ở đây. Có bài kiểm canh
 * chuyện đó (`noiDung.test.ts`), nên không quên âm thầm được.
 */
export const ICON_NHANH: Record<string, LucideIcon> = {
  Baby,
  Brain,
  Fingerprint,
  Flame,
  HeartPulse,
  Users,
}

/** Dùng khi tên icon không có trong bảng — thà một vòng tròn còn hơn vỡ trang. */
export const ICON_MAC_DINH = Circle

export function iconNhanh(ten: string): LucideIcon {
  return ICON_NHANH[ten] ?? ICON_MAC_DINH
}
