import { Nhanh as NhanhSchema, type Nhanh, type Chuong, type Phan } from './schema'
import { nhanThuc } from './du-lieu/nhan-thuc'

/**
 * Toàn bộ nội dung của app.
 *
 * Pilot mở đúng một nhánh. Các nhánh còn lại vẫn hiện trên lộ trình với nhãn
 * "Sắp có" — người xem thấy được app sẽ lớn tới đâu, thay vì tưởng đây là tất
 * cả những gì có.
 */
const sapCo = (
  id: string,
  tieuDe: string,
  moTa: string,
  icon: string,
): Nhanh => ({ id, tieuDe, moTa, icon, trangThai: 'sap-co', chuong: [] })

export const cacNhanh: Nhanh[] = [
  nhanThuc,
  sapCo('phat-trien', 'Tâm lý học phát triển', 'Con người thay đổi thế nào qua đời người', 'Baby'),
  sapCo('xa-hoi', 'Tâm lý học xã hội', 'Người khác ảnh hưởng ta ra sao', 'Users'),
  sapCo('nhan-cach', 'Nhân cách', 'Điều gì làm nên "con người riêng" của mỗi người', 'Fingerprint'),
  sapCo('cam-xuc', 'Cảm xúc và động lực', 'Điều gì thúc đẩy ta hành động', 'Flame'),
  sapCo('suc-khoe', 'Sức khoẻ tâm thần', 'Khi nào một trải nghiệm trở thành rối loạn', 'HeartPulse'),
]

/** Kiểm ngay lúc nạp module: sai cấu trúc thì vỡ ở dev, không âm thầm ra màn hình trống. */
if (import.meta.env.DEV) {
  for (const n of cacNhanh) {
    const kq = NhanhSchema.safeParse(n)
    if (!kq.success) {
      console.error(`Nhánh "${n.id}" sai cấu trúc:`, kq.error.issues)
    }
  }
}

export function timNhanh(id: string): Nhanh | undefined {
  return cacNhanh.find((n) => n.id === id)
}

export function timChuong(idNhanh: string, idChuong: string): Chuong | undefined {
  return timNhanh(idNhanh)?.chuong.find((c) => c.id === idChuong)
}

export function timPhan(
  idNhanh: string,
  idChuong: string,
  idPhan: string,
): { nhanh: Nhanh; chuong: Chuong; phan: Phan } | undefined {
  const nhanh = timNhanh(idNhanh)
  const chuong = nhanh?.chuong.find((c) => c.id === idChuong)
  const phan = chuong?.phan.find((p) => p.id === idPhan)
  if (!nhanh || !chuong || !phan) return undefined
  return { nhanh, chuong, phan }
}

/** Số liệu cho màn hình tổng quan. */
export const soLieu = {
  nhanhMo: cacNhanh.filter((n) => n.trangThai === 'mo').length,
  nhanhTong: cacNhanh.length,
  phanMo: cacNhanh
    .flatMap((n) => n.chuong)
    .flatMap((c) => c.phan)
    .filter((p) => p.trangThai === 'mo').length,
}

export type { Nhanh, Chuong, Phan }
