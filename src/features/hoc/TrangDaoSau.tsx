import { useNavigate, useParams, Link } from 'react-router'
import { X, Clock, ExternalLink, Lightbulb, AlertTriangle, Check, CloudOff } from 'lucide-react'
import { timPhan } from '@/content'
import type { Khoi } from '@/content/schema'
import { Nut } from '@/components/ui/Nut'
import { The } from '@/components/ui/co-ban'
import { khoaPhan, XP_DAO_SAU } from '@/features/tiendo/duLieu'
import { useGhiKhiDenCuoi } from '@/features/tiendo/useGhiKhiDenCuoi'

/**
 * Tầng ĐÀO SÂU — bài đọc học thuật.
 *
 * Ngược hẳn với tầng Nhanh: ở đó là thẻ ngắn và phản hồi tức thì, ở đây là
 * một cột chữ hẹp để đọc liền mạch. Không chia nhỏ, không gamification —
 * người chọn vào đây là người muốn hiểu cho kỹ.
 *
 * Nguồn đặt ở cuối và luôn hiện, không giấu sau nút "xem thêm". Một app dạy
 * tâm lý học mà giấu nguồn thì tự phá uy tín của chính nó.
 */

function RenderKhoi({ k }: { k: Khoi }) {
  switch (k.loai) {
    case 'tieuDe':
      return <h2 className="mt-8 mb-3 text-lg font-extrabold">{k.noiDung}</h2>

    case 'doan':
      return (
        <p className="mb-4 leading-[1.75]" dangerouslySetInnerHTML={{ __html: dam(k.noiDung) }} />
      )

    case 'nghienCuu':
      return (
        <figure className="my-6 rounded-lon border-l-4 border-sau bg-sau-nhat/60 p-5">
          <figcaption className="mb-2 flex items-center gap-2 text-sm font-extrabold text-sau">
            <Lightbulb className="size-4" aria-hidden />
            {k.tieuDe}
          </figcaption>
          {k.than.split('\n\n').map((d, i) => (
            <p key={i} className="mb-3 leading-[1.75]">
              {d}
            </p>
          ))}
          <p className="rounded-vua bg-nen p-3 leading-[1.7]">
            <strong className="text-sau">Nghĩa là: </strong>
            {k.nghiaLa}
          </p>
          {k.nguon && <p className="mt-2 text-xs text-chu-mo">Nguồn: {k.nguon}</p>}
        </figure>
      )

    case 'luuY':
      return (
        <aside className="my-6 rounded-lon border border-vang/30 bg-vang-nhat p-5">
          <p className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-vang">
            <AlertTriangle className="size-4" aria-hidden />
            {k.tieuDe}
          </p>
          <p className="leading-[1.7] text-chu">{k.noiDung}</p>
        </aside>
      )

    case 'bang':
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full min-w-full border-collapse text-sm">
            <thead>
              <tr>
                {k.cot.map((c) => (
                  <th
                    key={c}
                    className="border border-vien bg-nen-dju px-3 py-2 text-left font-bold"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {k.hang.map((h, i) => (
                <tr key={i}>
                  {h.map((o, j) => (
                    <td key={j} className="border border-vien px-3 py-2 align-top">
                      {o}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

/** Chỉ đổi **đậm** thành thẻ strong. Nội dung từ repo, đã qua review, nên tin được. */
function dam(s: string) {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

export function TrangDaoSau() {
  const { idNhanh = '', idChuong = '', idPhan = '' } = useParams()
  const navigate = useNavigate()
  const kq = timPhan(idNhanh, idChuong, idPhan)
  const ds = kq?.phan.daoSau

  // Ghi nhận khi người đọc xuống tới danh sách nguồn ở cuối bài.
  const { moc, daXong, ghiHong } = useGhiKhiDenCuoi({
    phanId: khoaPhan(idNhanh, idChuong, idPhan),
    huong: 'dao-sau',
    xp: XP_DAO_SAU,
    san: Boolean(ds),
  })

  if (!kq || !ds) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="text-chu-phu">Phần này chưa có bài đọc chuyên sâu.</p>
          <Link to="/" className="mt-3 inline-block font-bold text-nhan-dam underline">
            Về lộ trình
          </Link>
        </div>
      </div>
    )
  }

  const duongDanPhan = `/phan/${idNhanh}/${idChuong}/${idPhan}`

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-vien bg-nen/90 px-4 py-3 backdrop-blur lg:px-8">
        <button
          onClick={() => navigate(duongDanPhan)}
          className="shrink-0 text-chu-mo hover:text-chu"
          aria-label="Đóng bài đọc"
        >
          <X className="size-6" strokeWidth={2.5} />
        </button>
        <p className="min-w-0 flex-1 truncate text-sm font-bold">{kq.phan.tieuDe}</p>
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-chu-phu">
          <Clock className="size-4" aria-hidden />
          {ds.phutDoc} phút
        </span>
      </header>

      <main className="mx-auto w-full max-w-[42rem] flex-1 px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-extrabold lg:text-3xl">{kq.phan.tieuDe}</h1>
        <p className="mt-2 mb-8 text-lg text-chu-phu">{ds.tomTat}</p>

        <article className="text-[1.0625rem]">
          {ds.khoi.map((k, i) => (
            <RenderKhoi key={i} k={k} />
          ))}
        </article>

        <The className="my-8 bg-dung-nhat" nhan={false}>
          <h2 className="mb-3 text-sm font-extrabold tracking-wide text-dung uppercase">
            {ds.ghiNho.length} điều cần nhớ
          </h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            {ds.ghiNho.map((g) => (
              <li key={g} className="leading-relaxed">
                {g}
              </li>
            ))}
          </ol>
        </The>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-extrabold tracking-wide text-chu-phu uppercase">
            Thuật ngữ
          </h2>
          <ul className="flex flex-wrap gap-2">
            {ds.thuatNgu.map((t) => (
              <li
                key={t.vi}
                className="rounded-vua border border-vien px-3 py-1.5 text-sm"
                title={t.en}
              >
                {t.vi} <span className="text-chu-mo">· {t.en}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="mb-3 text-sm font-extrabold tracking-wide text-chu-phu uppercase">
            Nguồn đã kiểm chứng
          </h2>
          <ul className="flex flex-col gap-2.5">
            {ds.nguon.map((n) => (
              <li key={n.tenNgan} className="text-sm leading-relaxed">
                {n.url ? (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    // py-3 kéo vùng chạm lên trên 44px; -my-1 lấy lại bớt
                    // chiều cao đã thêm để danh sách không giãn ra quá.
                    className="-my-1 inline-flex items-center gap-1 py-3 font-bold text-nhan-dam underline"
                  >
                    {n.tenNgan}
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  <span className="font-bold">{n.tenNgan}</span>
                )}
                <span className="text-chu-phu"> — {n.moTa}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Mốc cuối bài. Chạm tới đây nghĩa là đã cuộn qua hết. */}
        <div ref={moc} aria-hidden className="h-px" />

        {daXong && (
          <p className="flex items-center justify-center gap-1.5 py-2 text-sm font-bold text-dung">
            <Check className="size-4" strokeWidth={3} aria-hidden />
            Đã đọc xong · +{XP_DAO_SAU} XP
          </p>
        )}
        {ghiHong && (
          <p className="flex items-center justify-center gap-1.5 py-2 text-sm text-chu-phu">
            <CloudOff className="size-4 shrink-0" aria-hidden />
            Chưa lưu được là đã đọc xong. Bài thì vẫn đọc được bình thường.
          </p>
        )}
      </main>

      <footer
        className="border-t border-vien"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-2.5 px-4 py-4 sm:flex-row lg:px-8">
          <Nut kieu="vien" co="lon" onClick={() => navigate(duongDanPhan)}>
            Xong
          </Nut>
          <Nut co="lon" onClick={() => navigate(`/hoc/${idNhanh}/${idChuong}/${idPhan}/ap-dung`)}>
            Đưa vào đời sống
          </Nut>
        </div>
      </footer>
    </div>
  )
}
