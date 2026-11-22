/**
 * localStorage nhưng không bao giờ ném.
 *
 * Trình duyệt ở chế độ riêng tư, người dùng chặn cookie, hoặc bộ nhớ đầy —
 * cả ba đều làm `localStorage` ném ngay ở lần đọc. Một tuỳ chọn nhỏ mà làm
 * trắng màn hình thì không đáng.
 *
 * Chỉ dùng cho tiện nghi của riêng máy này: đã xem màn chào chưa, có bật âm
 * thanh không. Mọi thứ cần giữ thật đều nằm ở database.
 */

const TIEN_TO = 'tam-do:'

export function docCucBo(khoa: string): string | null {
  try {
    return localStorage.getItem(TIEN_TO + khoa)
  } catch {
    return null
  }
}

export function ghiCucBo(khoa: string, giaTri: string) {
  try {
    localStorage.setItem(TIEN_TO + khoa, giaTri)
  } catch {
    // Không ghi được thì thôi, lần sau hỏi lại.
  }
}

export function docCo(khoa: string): boolean {
  return docCucBo(khoa) === '1'
}

export function ghiCo(khoa: string, bat: boolean) {
  ghiCucBo(khoa, bat ? '1' : '0')
}
