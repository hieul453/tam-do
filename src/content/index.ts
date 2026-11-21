import type { Bai, Chuong } from './schema'

/**
 * Nội dung bài học, nạp từ các file JSON do `npm run content:build` sinh ra.
 *
 * Thư mục `generated/` không được commit: nó luôn được dựng lại từ
 * `content/*.md` trước khi chạy dev hoặc build. Nhờ vậy markdown trong repo
 * là bản gốc duy nhất, không bao giờ lệch với dữ liệu app đang đọc.
 */
const cacFile = import.meta.glob<{ default: Chuong }>('./generated/*.json', { eager: true })

export const cacChuong: Chuong[] = Object.values(cacFile)
  .map((m) => m.default)
  .sort((a, b) => a.so - b.so)

export function timChuong(id: string): Chuong | undefined {
  return cacChuong.find((c) => c.id === id)
}

export function timBai(idBai: string): { chuong: Chuong; bai: Bai } | undefined {
  for (const chuong of cacChuong) {
    const bai = chuong.bai.find((b) => b.id === idBai)
    if (bai) return { chuong, bai }
  }
  return undefined
}

export const soLieu = {
  chuong: cacChuong.length,
  bai: cacChuong.reduce((n, c) => n + c.bai.length, 0),
  the: cacChuong.reduce((n, c) => n + c.bai.reduce((m, b) => m + b.hieuNhanh.length, 0), 0),
  minhHoaCanVe: cacChuong.reduce((n, c) => n + c.bai.reduce((m, b) => m + b.minhHoa.length, 0), 0),
}

export type { Bai, Chuong }
