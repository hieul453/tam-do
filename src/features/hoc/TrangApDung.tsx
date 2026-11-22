import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { X, Sparkles, CalendarCheck, LifeBuoy, Lock, Loader2, Check, CloudOff } from 'lucide-react'
import { timPhan } from '@/content'
import { Nut } from '@/components/ui/Nut'
import { The } from '@/components/ui/co-ban'
import { cn } from '@/lib/cn'
import { khoaPhan, XP_AP_DUNG } from '@/features/tiendo/duLieu'
import { useGhiKhiDenCuoi } from '@/features/tiendo/useGhiKhiDenCuoi'

/**
 * Tầng ÁP DỤNG — đưa kiến thức ra khỏi đầu.
 *
 * Phần trợ lý AI là chỗ khác biệt nhất so với Duolingo: thay vì chấm đúng sai,
 * nó nhận câu chuyện thật của người dùng và gợi ý dựa trên đúng kiến thức vừa
 * học. Bối cảnh gửi lên lấy từ `apDung.boiCanhAI` của phần đó, nên lời khuyên
 * bám vào bài chứ không trôi thành lời khuyên chung chung.
 *
 * Câu chuyện người dùng kể là dữ liệu nhạy cảm: không lưu, không log, và nói
 * rõ điều đó ngay trên màn hình trước khi họ gõ.
 */

function doanThanhKhoi(chu: string) {
  // Model được dặn trả về các mục bắt đầu bằng **Tiêu đề**. Tách nhẹ để hiển
  // thị cho dễ đọc; nếu nó trả khác thì vẫn hiện nguyên văn, không vỡ.
  return chu
    .split(/\n(?=\*\*)/)
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => {
      const m = /^\*\*(.+?)\*\*\s*([\s\S]*)$/.exec(k)
      return m ? { tieuDe: m[1].trim(), than: m[2].trim() } : { tieuDe: null, than: k }
    })
}

export function TrangApDung() {
  const { idNhanh = '', idChuong = '', idPhan = '' } = useParams()
  const navigate = useNavigate()
  const kq = timPhan(idNhanh, idChuong, idPhan)
  const ad = kq?.phan.apDung

  const [cauChuyen, setCauChuyen] = useState('')

  const { moc, daXong, ghiHong } = useGhiKhiDenCuoi({
    phanId: khoaPhan(idNhanh, idChuong, idPhan),
    huong: 'ap-dung',
    xp: XP_AP_DUNG,
    san: Boolean(ad),
  })

  const goiY = useMutation({
    mutationFn: async (chuyen: string) => {
      const res = await fetch('/api/goi-y', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ boiCanh: ad?.boiCanhAI ?? '', cauChuyen: chuyen }),
      })
      const du = (await res.json()) as { goiY?: string; loi?: string }
      if (!res.ok || !du.goiY) throw new Error(du.loi ?? 'Không gọi được trợ lý.')
      return du.goiY
    },
  })

  if (!kq || !ad) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="text-chu-phu">Phần này chưa có nội dung áp dụng.</p>
          <Link to="/" className="mt-3 inline-block font-bold text-nhan-dam underline">
            Về lộ trình
          </Link>
        </div>
      </div>
    )
  }

  const duongDanPhan = `/phan/${idNhanh}/${idChuong}/${idPhan}`
  const duNgan = cauChuyen.trim().length < 10

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-vien bg-nen/90 px-4 py-3 backdrop-blur lg:px-8">
        <button
          onClick={() => navigate(duongDanPhan)}
          className="shrink-0 text-chu-mo hover:text-chu"
          aria-label="Đóng"
        >
          <X className="size-6" strokeWidth={2.5} />
        </button>
        <p className="min-w-0 flex-1 truncate text-sm font-bold">{kq.phan.tieuDe}</p>
      </header>

      <main className="mx-auto w-full max-w-[42rem] flex-1 px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-extrabold lg:text-3xl">Đưa vào đời sống</h1>
        <p className="mt-2 mb-8 text-chu-phu">{kq.phan.moTa}</p>

        {/* Làm ngay hôm nay */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-extrabold tracking-wide text-chu-phu uppercase">
            Làm được ngay hôm nay
          </h2>
          <ul className="flex flex-col gap-3">
            {ad.lamNgay.map((x) => (
              <li key={x.tieuDe}>
                <The className="bg-dung-nhat/60">
                  <p className="font-bold text-dung">{x.tieuDe}</p>
                  <p className="mt-1 leading-relaxed text-chu">{x.moTa}</p>
                </The>
              </li>
            ))}
          </ul>
        </section>

        {/* Thử thách nhiều ngày */}
        <section className="mb-8">
          <The className="border-nhan/30 bg-nhan-nhat">
            <p className="mb-1.5 flex items-center gap-2 text-sm font-extrabold tracking-wide text-nhan-dam uppercase">
              <CalendarCheck className="size-4" aria-hidden />
              Thử thách {ad.thuThach.soNgay} ngày
            </p>
            <p className="font-bold">{ad.thuThach.tieuDe}</p>
            <p className="mt-1 leading-relaxed text-chu">{ad.thuThach.moTa}</p>
          </The>
        </section>

        {/* Trợ lý AI */}
        <section className="mb-8">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-extrabold tracking-wide text-sau uppercase">
            <Sparkles className="size-4" aria-hidden />
            Hỏi trợ lý về chuyện của bạn
          </h2>
          <p className="mb-4 text-sm text-chu-phu">
            Kể một tình huống thật, trợ lý sẽ gợi ý dựa trên đúng kiến thức của phần này.
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {ad.viDuTinhHuong.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setCauChuyen(v)}
                className="rounded-vua border border-vien px-3 py-1.5 text-left text-xs text-chu-phu hover:bg-nen-dju"
              >
                {v}
              </button>
            ))}
          </div>

          <label htmlFor="cau-chuyen" className="sr-only">
            Tình huống của bạn
          </label>
          <textarea
            id="cau-chuyen"
            value={cauChuyen}
            onChange={(e) => setCauChuyen(e.target.value.slice(0, 2000))}
            rows={5}
            placeholder="Kể tình huống bạn đang gặp…"
            className="w-full resize-y rounded-lon border-2 border-vien bg-nen p-4 leading-relaxed focus:border-sau focus:outline-none"
          />

          <div className="mt-2 mb-4 flex items-center justify-between gap-3 text-xs text-chu-mo">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5" aria-hidden />
              Câu chuyện của bạn chỉ dùng cho lần hỏi này — không lưu, không ghi log
            </span>
            <span className="shrink-0 tabular-nums">{cauChuyen.length}/2000</span>
          </div>

          <Nut
            co="lon"
            kieu="chinh"
            disabled={duNgan || goiY.isPending}
            onClick={() => goiY.mutate(cauChuyen.trim())}
          >
            {goiY.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Đang nghĩ…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden />
                Nhận gợi ý
              </>
            )}
          </Nut>

          {goiY.isError && (
            <p className="mt-3 rounded-vua bg-sai-nhat p-3 text-sm text-sai" role="alert">
              {goiY.error.message}
            </p>
          )}

          {goiY.data && (
            <div className="mt-5" aria-live="polite">
              <ul className="flex flex-col gap-3">
                {doanThanhKhoi(goiY.data).map((k, i) => (
                  <li key={i}>
                    <The className="border-sau/25 bg-sau-nhat/50">
                      {k.tieuDe && <p className="mb-1 font-bold text-sau">{k.tieuDe}</p>}
                      <p className="leading-relaxed whitespace-pre-line">{k.than}</p>
                    </The>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-chu-mo">
                Gợi ý do AI sinh ra, có thể sai. Đây không phải lời khuyên y tế hay trị liệu.
              </p>
            </div>
          )}
        </section>

        {/* Khi nào cần chuyên gia */}
        {ad.khiNaoTimChuyenGia && (
          <section className={cn('mb-4')}>
            <The className="border-vang/30 bg-vang-nhat">
              <p className="mb-1.5 flex items-center gap-2 text-sm font-extrabold tracking-wide text-vang uppercase">
                <LifeBuoy className="size-4" aria-hidden />
                Khi nào nên tìm chuyên gia
              </p>
              <p className="leading-relaxed text-chu">{ad.khiNaoTimChuyenGia}</p>
            </The>
          </section>
        )}

        {/* Mốc cuối trang. Chạm tới đây nghĩa là đã xem hết phần áp dụng. */}
        <div ref={moc} aria-hidden className="h-px" />

        {daXong && (
          <p className="flex items-center justify-center gap-1.5 py-2 text-sm font-bold text-dung">
            <Check className="size-4" strokeWidth={3} aria-hidden />
            Đã xem xong · +{XP_AP_DUNG} XP
          </p>
        )}
        {ghiHong && (
          <p className="flex items-center justify-center gap-1.5 py-2 text-sm text-chu-phu">
            <CloudOff className="size-4 shrink-0" aria-hidden />
            Chưa lưu được là đã xem xong. Phần này thì vẫn dùng được bình thường.
          </p>
        )}
      </main>

      <footer
        className="border-t border-vien"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto w-full max-w-[42rem] px-4 py-4 lg:px-8">
          <Nut co="lon" kieu="phu" onClick={() => navigate('/')}>
            Xong, về lộ trình
          </Nut>
        </div>
      </footer>
    </div>
  )
}
