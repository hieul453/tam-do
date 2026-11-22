import type { LucideIcon } from 'lucide-react'
import { Dumbbell, Trophy, User, Flame, Zap, Heart, Hammer } from 'lucide-react'
import { The, Huy, ThanhTienDo } from '@/components/ui/co-ban'
import { Nut } from '@/components/ui/Nut'
import { useAuth } from '@/lib/auth'

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
}: {
  icon: LucideIcon
  tieuDe: string
  moTa: string
  sePhai: string[]
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
            <Huy>Sắp có</Huy>
          </span>
          <p className="text-sm text-chu-phu">{moTa}</p>
        </div>
      </div>

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
  return (
    <Khung
      icon={Trophy}
      tieuDe="Thành tích"
      moTa="Những gì bạn đã đi qua"
      sePhai={[
        'Chuỗi ngày học liên tiếp, và cách giữ nó khi lỡ một hôm',
        'Huy hiệu theo cột mốc thật, không phải điểm cho vui',
        'Biểu đồ số khái niệm đã giải thích được bằng lời của mình',
      ]}
    />
  )
}

export function TrangToi() {
  const { session, laAnDanh, dangTai, lienKetGoogle, dangXuat } = useAuth()

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
          <span className="inline-flex items-center gap-1.5 font-bold text-vang">
            <Flame className="size-4" aria-hidden /> 0 ngày
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-nhan-dam">
            <Zap className="size-4" aria-hidden /> 0 XP
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-sai">
            <Heart className="size-4" aria-hidden /> 5
          </span>
        </div>
        <ThanhTienDo giaTri={0} tong={20} nhan="tiến độ mục tiêu hôm nay" />
        <p className="mt-2 text-xs text-chu-mo">
          Số liệu thật sẽ chạy khi làm xong phần XP và chuỗi ngày.
        </p>
      </The>

      <p className="text-center text-xs leading-relaxed text-chu-mo">
        Bản đang chạy <span className="font-mono">{__MA_BUILD__}</span>
        <br />
        Tâm Đồ là công cụ học tập, không thay thế chẩn đoán hay trị liệu.
      </p>
    </div>
  )
}
