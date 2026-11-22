import type { Nhanh } from '../schema'
import { triNho } from './tri-nho'

/** Nhánh mở khoá của bản pilot. */
export const nhanThuc: Nhanh = {
  id: 'nhan-thuc',
  tieuDe: 'Tâm lý học nhận thức',
  moTa: 'Cách tâm trí thu nhận, lưu giữ và dùng lại thông tin',
  icon: 'Brain',
  trangThai: 'mo',
  chuong: [
    triNho,
    {
      id: 'chu-y',
      tieuDe: 'Chú ý',
      cauHoi: 'Vì sao ta nhìn mà không thấy?',
      trangThai: 'sap-co',
      phan: [],
    },
    {
      id: 'tu-duy',
      tieuDe: 'Tư duy và ra quyết định',
      cauHoi: 'Những lối tắt nào của não hay dẫn ta đi sai?',
      trangThai: 'sap-co',
      phan: [],
    },
  ],
}
