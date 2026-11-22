import { Link, useParams } from 'react-router'
import { Zap, BookOpen, Sprout, ArrowLeft, ChevronRight, Check } from 'lucide-react'
import { timPhan } from '@/content'
import { The, Huy, ThanhTienDo } from '@/components/ui/co-ban'
import { cn } from '@/lib/cn'
import { useSoLieu, daXongHuong, khoaPhan } from '@/features/tiendo/duLieu'

/**
 * Màn hình chọn hướng tiếp cận.
 *
 * Đây là điểm khác lớn nhất so với Duolingo: ở họ, một node là một bài và
 * không có lựa chọn. Ở đây cùng một nội dung có ba đường vào, vì ba kiểu
 * người học khác nhau — và cùng một người cũng đổi nhu cầu theo lúc.
 *
 * Ba thẻ cố tình ngang hàng nhau, không thẻ nào được tô đậm hơn: không có
 * đường nào là "đúng", chọn theo việc bạn đang cần gì.
 */

const HUONG = [
  {
    ma: 'nhanh',
    ten: 'Nhanh',
    moTa: 'Nắm ý chính trong vài phút bằng thẻ lật và câu hỏi ngắn',
    icon: Zap,
    mau: 'text-nhan-dam',
    nen: 'bg-nhan-nhat',
    vien: 'hover:border-nhan/50',
  },
  {
    ma: 'dao-sau',
    ten: 'Đào sâu',
    moTa: 'Hiểu vì sao, qua nghiên cứu thật và nguồn dẫn đầy đủ',
    icon: BookOpen,
    mau: 'text-sau',
    nen: 'bg-sau-nhat',
    vien: 'hover:border-sau/50',
  },
  {
    ma: 'ap-dung',
    ten: 'Áp dụng',
    moTa: 'Đưa vào đời sống, có trợ lý AI gợi ý cho đúng chuyện của bạn',
    icon: Sprout,
    mau: 'text-dung',
    nen: 'bg-dung-nhat',
    vien: 'hover:border-dung/50',
  },
] as const

export function TrangPhan() {
  const { idNhanh = '', idChuong = '', idPhan = '' } = useParams()
  const kq = timPhan(idNhanh, idChuong, idPhan)
  const { soLieu, luuDuoc } = useSoLieu()
  const khoa = khoaPhan(idNhanh, idChuong, idPhan)

  if (!kq) {
    return (
      <div className="py-12 text-center">
        <p className="text-chu-phu">Không tìm thấy phần học này.</p>
        <Link to="/" className="mt-3 inline-block font-bold text-nhan-dam underline">
          Về lộ trình
        </Link>
      </div>
    )
  }

  const { chuong, phan } = kq
  const soBaiTap = phan.nhanh?.length ?? 0

  const sanSang: Record<string, boolean> = {
    nhanh: soBaiTap > 0,
    'dao-sau': Boolean(phan.daoSau),
    'ap-dung': Boolean(phan.apDung),
  }

  const tongHuong = Object.values(sanSang).filter(Boolean).length
  const xongHuong = HUONG.filter((h) => sanSang[h.ma] && daXongHuong(soLieu, khoa, h.ma)).length

  return (
    <div>
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-chu-phu hover:text-chu"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {chuong.tieuDe}
      </Link>

      <h1 className="text-2xl font-extrabold">{phan.tieuDe}</h1>
      <p className="mt-1 mb-7 text-chu-phu">{phan.moTa}</p>

      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-chu-phu uppercase">
          Chọn cách bạn muốn học
        </h2>
        {luuDuoc && (
          <span className="shrink-0 text-xs font-bold tabular-nums text-chu-phu">
            {xongHuong}/{tongHuong} cách
          </span>
        )}
      </div>

      {luuDuoc && (
        <ThanhTienDo
          giaTri={xongHuong}
          tong={tongHuong}
          className="mb-4 h-1.5"
          nhan={`đã học ${xongHuong} trên ${tongHuong} cách`}
        />
      )}

      <ul className="flex flex-col gap-3">
        {HUONG.map(({ ma, ten, moTa, icon: Icon, mau, nen, vien }) => {
          const duoc = sanSang[ma]
          const xong = duoc && daXongHuong(soLieu, khoa, ma)
          const noiDung = (
            <>
              <span
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-vua',
                  xong ? 'bg-dung' : nen,
                )}
              >
                {xong ? (
                  <Check className="size-6 text-white" strokeWidth={3} aria-hidden />
                ) : (
                  <Icon
                    className={cn('size-6', duoc ? mau : 'text-chu-mo')}
                    strokeWidth={2.2}
                    aria-hidden
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className={cn('font-extrabold', !duoc && 'text-chu-phu')}>{ten}</span>
                  {xong && <Huy mau="dung">Đã xong</Huy>}
                  {ma === 'nhanh' && duoc && !xong && <Huy mau="nhan">{soBaiTap} bài tập</Huy>}
                  {!duoc && <Huy>Sắp có</Huy>}
                </span>
                <span className="mt-0.5 block text-sm text-chu-phu">
                  {xong && ma === 'nhanh' ? 'Làm lại để nhớ lâu hơn' : moTa}
                </span>
              </span>
              {duoc && <ChevronRight className="size-5 shrink-0 text-chu-mo" aria-hidden />}
            </>
          )

          return (
            <li key={ma}>
              {duoc ? (
                <Link
                  to={`/hoc/${idNhanh}/${idChuong}/${idPhan}/${ma}`}
                  className={cn(
                    'flex items-center gap-4 rounded-lon border p-4 transition-colors',
                    xong ? 'border-dung/35 bg-dung-nhat/40' : 'border-vien bg-nen',
                    vien,
                  )}
                >
                  {noiDung}
                </Link>
              ) : (
                <The className="flex items-center gap-4 bg-nen-dju p-4">{noiDung}</The>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
