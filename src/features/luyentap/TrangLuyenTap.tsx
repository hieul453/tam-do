import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { Dumbbell, Hammer, Shuffle, Sprout } from 'lucide-react'
import { The, Huy } from '@/components/ui/co-ban'
import { Nut } from '@/components/ui/Nut'
import { useSoLieu } from '@/features/tiendo/duLieu'
import { cauDaHoc, SO_CAU_LUYEN_TAP } from './chonBaiOn'

/**
 * Luyện tập — ôn lại những phần đã học.
 *
 * Duolingo có tab này vì nó giải quyết một vấn đề thật: học xong rồi để đó thì
 * quên, mà quay lại làm lại từng bài thì nản. Một phiên trộn ngắn giữ được
 * chuỗi ngày trong những hôm không có thời gian học phần mới.
 *
 * Phiên chạy ở route riêng `/luyen-tap/phien` để chiếm trọn màn hình, giống
 * phiên học. Màn này chỉ nói có gì để ôn và mở cửa.
 */
export function TrangLuyenTap() {
  const navigate = useNavigate()
  const { soLieu, sanSang, luuDuoc } = useSoLieu()

  const kho = useMemo(() => cauDaHoc(soLieu), [soLieu])

  const soCau = Math.min(kho.length, SO_CAU_LUYEN_TAP)

  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-vua bg-nhan-nhat text-nhan-dam">
          <Dumbbell className="size-6" strokeWidth={2.2} aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold">Luyện tập</h1>
          <p className="text-sm text-chu-phu">Ôn lại những gì đã học, trước khi quên thật</p>
        </div>
      </div>

      {!sanSang ? (
        <The className="bg-nen-dju">
          <p className="text-sm text-chu-phu">Đang xem bạn đã học những gì…</p>
        </The>
      ) : kho.length === 0 ? (
        <The className="bg-nen-dju">
          <Sprout className="mb-2 size-7 text-chu-mo" strokeWidth={2} aria-hidden />
          <h2 className="font-bold">Chưa có gì để ôn</h2>
          <p className="mt-1 mb-4 text-sm text-chu-phu">
            {luuDuoc
              ? 'Luyện tập lấy câu hỏi từ những phần bạn đã học xong. Làm xong một phần trước đã.'
              : 'Máy chủ lưu trữ chưa được cấu hình, nên chưa biết bạn đã học những gì.'}
          </p>
          <Link to="/">
            <Nut kieu="vien" co="lon">
              Về lộ trình
            </Nut>
          </Link>
        </The>
      ) : (
        <The nhan>
          <p className="mb-1 flex items-center gap-2 text-sm font-extrabold tracking-wide text-nhan-dam uppercase">
            <Shuffle className="size-4" aria-hidden />
            Phiên ôn nhanh
          </p>
          <p className="mb-4 text-chu">
            {soCau} câu trộn từ {kho.length} câu bạn đã học. Vẫn được XP, vẫn giữ chuỗi ngày.
          </p>
          <Nut co="lon" onClick={() => void navigate('/luyen-tap/phien')}>
            Bắt đầu ôn
          </Nut>
        </The>
      )}

      <The className="mt-4 bg-nen-dju">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-chu-phu">
          <Hammer className="size-4" aria-hidden />
          Phần này sẽ có thêm
          <Huy>Sắp có</Huy>
        </p>
        <ul className="flex flex-col gap-2 text-sm text-chu-phu">
          <li className="flex gap-2">
            <span className="text-chu-mo" aria-hidden>
              •
            </span>
            Ôn giãn cách: câu nào sắp rơi khỏi trí nhớ thì nổi lên trước. Hiện phiên ôn trộn ngẫu
            nhiên, vì app chưa lưu từng câu trả lời sai.
          </li>
          <li className="flex gap-2">
            <span className="text-chu-mo" aria-hidden>
              •
            </span>
            Luyện riêng những câu từng trả lời sai.
          </li>
        </ul>
      </The>
    </div>
  )
}
