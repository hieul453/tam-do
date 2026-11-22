import { docCucBo, ghiCo } from './kho-cuc-bo'

/**
 * Âm phản hồi, tổng hợp tại chỗ bằng Web Audio.
 *
 * Không dùng file âm thanh: backlog vướng ở chỗ phải tìm nguồn miễn phí có
 * giấy phép rõ ràng, mà vài nốt sine thì trình duyệt tự tạo được. Đổi lại:
 * không thêm byte nào vào bundle, không có gì để xin phép, và đổi nốt chỉ là
 * sửa một con số.
 *
 * Nguyên tắc: âm thanh chỉ là lớp phủ. Mọi thứ nó báo đều đã có trên màn hình
 * rồi — tắt tiếng đi thì không mất thông tin nào.
 */

const KHOA_TAT = 'tat-am-thanh'

/** Mặc định bật, như Duolingo. Tắt bằng một chạm ở trang Tôi. */
export function amThanhDangBat() {
  return docCucBo(KHOA_TAT) !== '1'
}

export function datAmThanh(bat: boolean) {
  ghiCo(KHOA_TAT, !bat)
}

type Not = { tanSo: number; batDau: number; dai: number; am?: number }

const BAN: Record<string, Not[]> = {
  // Hai nốt đi lên: ngắn, sáng, không reo dài.
  dung: [
    { tanSo: 659.25, batDau: 0, dai: 0.08 },
    { tanSo: 987.77, batDau: 0.07, dai: 0.13 },
  ],
  // Một nốt trầm đi xuống. Đủ để biết là sai, không đủ để thấy bị mắng.
  sai: [{ tanSo: 196, batDau: 0, dai: 0.2, am: 0.07 }],
  // Rải bốn nốt: dành riêng cho lúc xong cả phiên, nên được phép vui hơn.
  xong: [
    { tanSo: 523.25, batDau: 0, dai: 0.1 },
    { tanSo: 659.25, batDau: 0.09, dai: 0.1 },
    { tanSo: 783.99, batDau: 0.18, dai: 0.1 },
    { tanSo: 1046.5, batDau: 0.27, dai: 0.3 },
  ],
  // Nhạt nhất: dùng cho những cú chạm cần một chút xác nhận.
  cham: [{ tanSo: 880, batDau: 0, dai: 0.05, am: 0.04 }],
}

export type TenAm = keyof typeof BAN

let boAm: AudioContext | null = null

function layBoAm(): AudioContext | null {
  if (boAm) return boAm
  try {
    const Tao =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Tao) return null
    boAm = new Tao()
    return boAm
  } catch {
    return null
  }
}

/**
 * Phát một âm. Không bao giờ ném, không bao giờ chặn.
 *
 * Trình duyệt chỉ cho phát sau một thao tác thật của người dùng; mọi lời gọi ở
 * đây đều đến từ một cú bấm nên điều đó thoả. Nếu vẫn bị chặn thì im lặng bỏ
 * qua — không có gì để báo lỗi cả.
 */
export function phatAm(ten: TenAm) {
  if (!amThanhDangBat()) return
  const ctx = layBoAm()
  if (!ctx) return

  try {
    if (ctx.state === 'suspended') void ctx.resume()
    const bay = ctx.currentTime

    for (const not of BAN[ten]) {
      const dao = ctx.createOscillator()
      const khuechDai = ctx.createGain()
      dao.type = 'sine'
      dao.frequency.value = not.tanSo

      const dinh = not.am ?? 0.09
      const t0 = bay + not.batDau
      // Lên nhanh rồi tắt dần: vào thẳng biên độ sẽ nghe thành tiếng "cạch".
      khuechDai.gain.setValueAtTime(0.0001, t0)
      khuechDai.gain.exponentialRampToValueAtTime(dinh, t0 + 0.012)
      khuechDai.gain.exponentialRampToValueAtTime(0.0001, t0 + not.dai)

      dao.connect(khuechDai).connect(ctx.destination)
      dao.start(t0)
      dao.stop(t0 + not.dai + 0.02)
    }
  } catch {
    // Thiết bị không phát được thì thôi.
  }
}
