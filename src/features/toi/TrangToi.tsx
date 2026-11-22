import { useState } from 'react'
import { Flame, Zap, Heart, Check, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { The, ThanhTienDo } from '@/components/ui/co-ban'
import { Nut } from '@/components/ui/Nut'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { useSoLieu, useDatMucTieu, useDatLaiTienDo, MUC_TIEU } from '@/features/tiendo/duLieu'
import { amThanhDangBat, datAmThanh, phatAm } from '@/lib/am-thanh'
import { ghiCo } from '@/lib/kho-cuc-bo'
import { KHOA_DA_CHAO } from '@/features/chao/khoa'

/**
 * Trang Tôi: tài khoản, số liệu hôm nay, mục tiêu ngày, âm thanh.
 *
 * Trước đây nằm chung file với các trang "sắp có". Giờ không còn trang nào
 * sắp có nữa nên tách ra đứng riêng.
 */
export function TrangToi() {
  const { session, laAnDanh, dangTai, lienKetGoogle, dangXuat } = useAuth()
  const { soLieu, sanSang, luuDuoc } = useSoLieu()
  const datMucTieu = useDatMucTieu()
  const xongMucTieu = soLieu.xpHomNay >= soLieu.mucTieuXpNgay
  const [amThanh, datAmThanhState] = useState(amThanhDangBat)
  const datLai = useDatLaiTienDo()
  const [hoiDatLai, datHoiDatLai] = useState(false)

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
          <span
            className={cn(
              'inline-flex items-center gap-1.5 font-bold',
              soLieu.chuoi > 0 ? 'text-vang' : 'text-chu-mo',
            )}
          >
            <Flame className={cn('size-4', soLieu.chuoi > 0 && 'fill-vang')} aria-hidden />
            {sanSang ? soLieu.chuoi : '–'} ngày
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-nhan-dam">
            <Zap className="size-4" aria-hidden /> {sanSang ? soLieu.xpHomNay : '–'} XP
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 font-bold',
              soLieu.tim > 0 ? 'text-sai' : 'text-chu-mo',
            )}
          >
            <Heart className={cn('size-4', soLieu.tim > 0 && 'fill-sai')} aria-hidden />
            {sanSang ? soLieu.tim : '–'}
          </span>
        </div>
        <ThanhTienDo
          giaTri={soLieu.xpHomNay}
          tong={soLieu.mucTieuXpNgay}
          mau={xongMucTieu ? 'dung' : 'nhan'}
          nhan="tiến độ mục tiêu hôm nay"
        />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-chu-phu">
          {xongMucTieu && <Check className="size-3.5 text-dung" strokeWidth={3} aria-hidden />}
          {soLieu.xpHomNay} / {soLieu.mucTieuXpNgay} XP
          {soLieu.chuoiDaiNhat > 0 && (
            <span className="text-chu-mo">· chuỗi dài nhất {soLieu.chuoiDaiNhat} ngày</span>
          )}
        </p>
      </The>

      <The className="mb-4">
        <h2 className="mb-1 text-sm font-bold">Mục tiêu mỗi ngày</h2>
        <p className="mb-3 text-sm text-chu-phu">
          Chọn mức giữ được đều, không phải mức cao nhất. Đều đặn mới thành chuỗi.
        </p>
        <div className="flex flex-wrap gap-2">
          {MUC_TIEU.map((xp) => {
            const dangChon = soLieu.mucTieuXpNgay === xp
            return (
              <button
                key={xp}
                type="button"
                disabled={!luuDuoc || datMucTieu.isPending}
                onClick={() => datMucTieu.mutate(xp)}
                aria-pressed={dangChon}
                className={cn(
                  'min-h-11 rounded-vua border-2 px-4 text-sm font-bold transition-colors disabled:opacity-50',
                  dangChon
                    ? 'border-nhan bg-nhan-nhat text-nhan-dam'
                    : 'border-vien text-chu-phu hover:bg-nen-dju',
                )}
              >
                {xp} XP
              </button>
            )
          })}
        </div>
        {!luuDuoc && (
          <p className="mt-3 text-xs text-chu-mo">
            Máy chủ lưu trữ chưa được cấu hình, nên chưa đổi được mục tiêu.
          </p>
        )}
      </The>

      <The className="mb-4">
        <h2 className="mb-1 text-sm font-bold">Âm thanh</h2>
        <p className="mb-3 text-sm text-chu-phu">
          Tiếng ngắn khi trả lời đúng, sai và khi xong phiên. Tắt đi vẫn thấy đủ mọi thứ trên màn
          hình.
        </p>
        <button
          type="button"
          onClick={() => {
            const moi = !amThanh
            datAmThanh(moi)
            datAmThanhState(moi)
            if (moi) phatAm('dung')
          }}
          aria-pressed={amThanh}
          className={cn(
            'flex min-h-11 w-full items-center justify-between rounded-vua border-2 px-4 text-sm font-bold transition-colors',
            amThanh ? 'border-nhan bg-nhan-nhat text-nhan-dam' : 'border-vien text-chu-phu',
          )}
        >
          <span className="flex items-center gap-2">
            {amThanh ? (
              <Volume2 className="size-4" aria-hidden />
            ) : (
              <VolumeX className="size-4" aria-hidden />
            )}
            {amThanh ? 'Đang bật' : 'Đang tắt'}
          </span>
          <span className="text-xs font-normal text-chu-mo">
            {amThanh ? 'chạm để tắt' : 'chạm để bật'}
          </span>
        </button>
      </The>

      <The className="mb-4">
        <h2 className="mb-1 text-sm font-bold">Đặt lại tiến độ</h2>
        <p className="mb-3 text-sm text-chu-phu">
          Xoá XP, chuỗi ngày và các phần đã xong, để diễn lại từ đầu. Tài khoản và mục tiêu ngày giữ
          nguyên. Không hoàn lại được.
        </p>
        {hoiDatLai ? (
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Nut kieu="vien" co="lon" onClick={() => datHoiDatLai(false)}>
              Thôi
            </Nut>
            <Nut
              kieu="nguy"
              co="lon"
              disabled={datLai.isPending}
              onClick={() => {
                datLai.mutate()
                datHoiDatLai(false)
                // Xoá luôn cờ màn chào: diễn lại thì phải thấy từ màn đầu tiên.
                ghiCo(KHOA_DA_CHAO, false)
              }}
            >
              {datLai.isPending ? 'Đang xoá…' : 'Xoá, tôi chắc chắn'}
            </Nut>
          </div>
        ) : (
          <Nut
            kieu="tron"
            co="lon"
            disabled={!luuDuoc}
            onClick={() => datHoiDatLai(true)}
            className="text-sai"
          >
            <RotateCcw className="size-4" aria-hidden />
            Đặt lại tiến độ
          </Nut>
        )}
        {datLai.isError && (
          <p className="mt-3 text-xs text-sai">Chưa xoá được. Thử lại sau một lát.</p>
        )}
        {datLai.isSuccess && !hoiDatLai && (
          <p className="mt-3 text-xs text-dung">Đã đặt lại. Tải lại trang để thấy màn chào.</p>
        )}
      </The>

      <p className="text-center text-xs leading-relaxed text-chu-mo">
        Bản đang chạy <span className="font-mono">{__MA_BUILD__}</span>
        <br />
        Tâm Đồ là công cụ học tập, không thay thế chẩn đoán hay trị liệu.
      </p>
    </div>
  )
}
