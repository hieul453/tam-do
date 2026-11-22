import { useMemo, useState, useEffect } from 'react'
import type { BaiTap } from '@/content/schema'
import { cn } from '@/lib/cn'

/**
 * Sáu loại bài tập, cùng một hợp đồng với trình chạy phiên:
 *
 *   traLoi     giá trị người học đã chọn (null = chưa trả lời)
 *   datTraLoi  báo lên cho trình chạy
 *   daKhoa     đã bấm Kiểm tra rồi, không cho sửa nữa
 *
 * Việc chấm đúng/sai do `kiemTra` lo, không nằm trong component — để trình
 * chạy quyết định lúc nào chấm và xử lý tim, điểm, xếp lại hàng đợi.
 */

export type TraLoi = number | boolean | string | string[] | null

/** Trộn ngẫu nhiên nhưng ổn định theo id bài tập — không xáo lại mỗi lần render. */
function tronTheoId<T>(mang: T[], hat: string): T[] {
  let h = 0
  for (let i = 0; i < hat.length; i++) h = (h * 31 + hat.charCodeAt(i)) >>> 0
  const ra = [...mang]
  for (let i = ra.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0
    const j = h % (i + 1)
    ;[ra[i], ra[j]] = [ra[j], ra[i]]
  }
  return ra
}

export function kiemTra(bt: BaiTap, traLoi: TraLoi): boolean {
  switch (bt.loai) {
    case 'the-lat':
      return true // thẻ dạy, không chấm
    case 'chon-mot':
      return traLoi === bt.dapAn
    case 'dung-sai':
      return traLoi === bt.dung
    case 'dien-tu':
      return traLoi === bt.dapAn
    case 'xep-thu-tu':
      return (
        Array.isArray(traLoi) &&
        traLoi.length === bt.dungThuTu.length &&
        traLoi.every((x, i) => x === bt.dungThuTu[i])
      )
    case 'ghep-doi':
      return (
        Array.isArray(traLoi) &&
        traLoi.length === bt.cap.length &&
        bt.cap.every((c) => traLoi.includes(`${c.trai}→${c.phai}`))
      )
  }
}

/** Câu hỏi hiển thị ở đầu mỗi bài, để trình chạy dùng chung một kiểu chữ. */
export function cauHoiCua(bt: BaiTap): string {
  switch (bt.loai) {
    case 'the-lat':
      return 'Ghi nhớ khái niệm này'
    case 'dung-sai':
      return 'Đúng hay sai?'
    case 'dien-tu':
      return 'Điền từ còn thiếu'
    default:
      return bt.cauHoi
  }
}

/* ─────────────────────────── Mảnh dùng chung ────────────────────────────── */

function OChon({
  children,
  chon,
  dung,
  sai,
  onClick,
  disabled,
  phim,
}: {
  children: React.ReactNode
  chon?: boolean
  dung?: boolean
  sai?: boolean
  onClick?: () => void
  disabled?: boolean
  phim?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={chon}
      className={cn(
        'flex w-full items-center gap-3 rounded-vua border-2 border-b-4 px-4 py-3.5 text-left font-medium transition-colors',
        'disabled:cursor-default',
        dung
          ? 'border-dung bg-dung-nhat text-dung'
          : sai
            ? 'border-sai bg-sai-nhat text-sai'
            : chon
              ? 'border-nhan bg-nhan-nhat text-nhan-dam'
              : 'border-vien bg-nen hover:bg-nen-dju',
      )}
    >
      {phim !== undefined && (
        <span
          className={cn(
            'grid size-6 shrink-0 place-items-center rounded-md border text-xs font-bold',
            dung
              ? 'border-dung/40'
              : sai
                ? 'border-sai/40'
                : chon
                  ? 'border-nhan/50'
                  : 'border-vien text-chu-mo',
          )}
          aria-hidden
        >
          {phim}
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  )
}

/* ──────────────────────────────── Thẻ lật ───────────────────────────────── */

function TheLat({
  bt,
  datTraLoi,
}: {
  bt: Extract<BaiTap, { loai: 'the-lat' }>
  datTraLoi: (t: TraLoi) => void
}) {
  const [lat, setLat] = useState(false)

  // Chỉ cho đi tiếp sau khi đã lật — nếu không thì thẻ dạy thành thẻ bỏ qua.
  useEffect(() => {
    datTraLoi(lat ? 0 : null)
  }, [lat, datTraLoi])

  return (
    <button
      type="button"
      onClick={() => setLat((x) => !x)}
      className="flex min-h-[13rem] w-full flex-col items-center justify-center gap-3 rounded-lon border-2 border-b-4 border-vien bg-nen p-6 text-center"
    >
      <span className="text-xl font-extrabold">{bt.mat_truoc}</span>
      {lat ? (
        <span className="text-chu-phu">{bt.mat_sau}</span>
      ) : (
        <span className="text-sm font-bold tracking-wide text-nhan-dam uppercase">Chạm để xem</span>
      )}
    </button>
  )
}

/* ───────────────────────────── Chọn một / Đúng sai ──────────────────────── */

function ChonMot({
  bt,
  traLoi,
  datTraLoi,
  daKhoa,
}: {
  bt: Extract<BaiTap, { loai: 'chon-mot' }>
  traLoi: TraLoi
  datTraLoi: (t: TraLoi) => void
  daKhoa: boolean
}) {
  return (
    <ul className="flex flex-col gap-3">
      {bt.luaChon.map((lc, i) => (
        <li key={i}>
          <OChon
            phim={i + 1}
            chon={traLoi === i}
            dung={daKhoa && i === bt.dapAn}
            sai={daKhoa && traLoi === i && i !== bt.dapAn}
            disabled={daKhoa}
            onClick={() => datTraLoi(i)}
          >
            {lc}
          </OChon>
        </li>
      ))}
    </ul>
  )
}

function DungSai({
  bt,
  traLoi,
  datTraLoi,
  daKhoa,
}: {
  bt: Extract<BaiTap, { loai: 'dung-sai' }>
  traLoi: TraLoi
  datTraLoi: (t: TraLoi) => void
  daKhoa: boolean
}) {
  return (
    <>
      <p className="mb-5 rounded-lon border-2 border-vien bg-nen-dju p-5 text-lg font-medium">
        {bt.menhDe}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((gt) => (
          <OChon
            key={String(gt)}
            chon={traLoi === gt}
            dung={daKhoa && gt === bt.dung}
            sai={daKhoa && traLoi === gt && gt !== bt.dung}
            disabled={daKhoa}
            onClick={() => datTraLoi(gt)}
          >
            <span className="block text-center font-bold">{gt ? 'Đúng' : 'Sai'}</span>
          </OChon>
        ))}
      </div>
    </>
  )
}

/* ───────────────────────────────── Điền từ ──────────────────────────────── */

function DienTu({
  bt,
  traLoi,
  datTraLoi,
  daKhoa,
}: {
  bt: Extract<BaiTap, { loai: 'dien-tu' }>
  traLoi: TraLoi
  datTraLoi: (t: TraLoi) => void
  daKhoa: boolean
}) {
  const tu = useMemo(() => tronTheoId([bt.dapAn, ...bt.nhieu], bt.id), [bt])
  return (
    <>
      <p className="mb-6 text-lg leading-relaxed">
        {bt.cauTruoc}{' '}
        <span
          className={cn(
            'inline-block min-w-[7rem] rounded-md border-b-2 px-2 pb-0.5 text-center font-bold',
            traLoi
              ? daKhoa
                ? traLoi === bt.dapAn
                  ? 'border-dung text-dung'
                  : 'border-sai text-sai'
                : 'border-nhan text-nhan-dam'
              : 'border-vien-dam text-chu-mo',
          )}
        >
          {typeof traLoi === 'string' ? traLoi : ' '}
        </span>{' '}
        {bt.cauSau}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {tu.map((t) => (
          <button
            key={t}
            type="button"
            disabled={daKhoa}
            onClick={() => datTraLoi(traLoi === t ? null : t)}
            className={cn(
              'rounded-vua border-2 border-b-4 px-4 py-2 font-medium disabled:cursor-default',
              traLoi === t ? 'border-nhan bg-nhan-nhat text-nhan-dam' : 'border-vien bg-nen',
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  )
}

/* ──────────────────────────────── Xếp thứ tự ────────────────────────────── */

function XepThuTu({
  bt,
  traLoi,
  datTraLoi,
  daKhoa,
}: {
  bt: Extract<BaiTap, { loai: 'xep-thu-tu' }>
  traLoi: TraLoi
  datTraLoi: (t: TraLoi) => void
  daKhoa: boolean
}) {
  const kho = useMemo(() => tronTheoId(bt.dungThuTu, bt.id), [bt])
  const daXep = Array.isArray(traLoi) ? (traLoi as string[]) : []
  const conLai = kho.filter((x) => !daXep.includes(x))

  return (
    <>
      <ol className="mb-5 flex min-h-[9rem] flex-col gap-2 rounded-lon border-2 border-dashed border-vien p-3">
        {daXep.length === 0 && (
          <li className="py-6 text-center text-sm text-chu-mo">Chạm các ô bên dưới theo thứ tự</li>
        )}
        {daXep.map((x, i) => (
          <li key={x}>
            <button
              type="button"
              disabled={daKhoa}
              onClick={() => datTraLoi(daXep.filter((y) => y !== x))}
              className={cn(
                'flex w-full items-center gap-3 rounded-vua border-2 px-3 py-2.5 text-left font-medium disabled:cursor-default',
                daKhoa
                  ? x === bt.dungThuTu[i]
                    ? 'border-dung bg-dung-nhat text-dung'
                    : 'border-sai bg-sai-nhat text-sai'
                  : 'border-nhan bg-nhan-nhat text-nhan-dam',
              )}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md border border-current text-xs font-bold">
                {i + 1}
              </span>
              {x}
            </button>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2.5">
        {conLai.map((x) => (
          <button
            key={x}
            type="button"
            disabled={daKhoa}
            onClick={() => datTraLoi([...daXep, x])}
            className="rounded-vua border-2 border-b-4 border-vien bg-nen px-4 py-2 font-medium disabled:cursor-default"
          >
            {x}
          </button>
        ))}
      </div>
    </>
  )
}

/* ───────────────────────────────── Ghép đôi ─────────────────────────────── */

function GhepDoi({
  bt,
  traLoi,
  datTraLoi,
  daKhoa,
}: {
  bt: Extract<BaiTap, { loai: 'ghep-doi' }>
  traLoi: TraLoi
  datTraLoi: (t: TraLoi) => void
  daKhoa: boolean
}) {
  const [dangChon, setDangChon] = useState<string | null>(null)
  const cap = Array.isArray(traLoi) ? (traLoi as string[]) : []
  const phai = useMemo(
    () =>
      tronTheoId(
        bt.cap.map((c) => c.phai),
        bt.id,
      ),
    [bt],
  )

  const daGhepTrai = (t: string) => cap.some((c) => c.startsWith(`${t}→`))
  const daGhepPhai = (p: string) => cap.some((c) => c.endsWith(`→${p}`))
  const dungCua = (t: string) => bt.cap.find((c) => c.trai === t)?.phai

  function chonPhai(p: string) {
    if (!dangChon || daGhepPhai(p)) return
    datTraLoi([...cap, `${dangChon}→${p}`])
    setDangChon(null)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <ul className="flex flex-col gap-2.5">
        {bt.cap.map((c) => {
          const ghep = daGhepTrai(c.trai)
          const dung = daKhoa && cap.includes(`${c.trai}→${dungCua(c.trai)}`)
          return (
            <li key={c.trai}>
              <OChon
                chon={dangChon === c.trai || (ghep && !daKhoa)}
                dung={dung}
                sai={daKhoa && ghep && !dung}
                disabled={daKhoa || ghep}
                onClick={() => setDangChon(c.trai)}
              >
                <span className="text-sm">{c.trai}</span>
              </OChon>
            </li>
          )
        })}
      </ul>
      <ul className="flex flex-col gap-2.5">
        {phai.map((p) => {
          const ghep = daGhepPhai(p)
          return (
            <li key={p}>
              <OChon chon={ghep && !daKhoa} disabled={daKhoa || ghep} onClick={() => chonPhai(p)}>
                <span className="text-sm">{p}</span>
              </OChon>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ──────────────────────────────── Bộ chọn ───────────────────────────────── */

export function RenderBaiTap(props: {
  bt: BaiTap
  traLoi: TraLoi
  datTraLoi: (t: TraLoi) => void
  daKhoa: boolean
}) {
  const { bt } = props
  switch (bt.loai) {
    case 'the-lat':
      return <TheLat bt={bt} datTraLoi={props.datTraLoi} />
    case 'chon-mot':
      return <ChonMot {...props} bt={bt} />
    case 'dung-sai':
      return <DungSai {...props} bt={bt} />
    case 'dien-tu':
      return <DienTu {...props} bt={bt} />
    case 'xep-thu-tu':
      return <XepThuTu {...props} bt={bt} />
    case 'ghep-doi':
      return <GhepDoi {...props} bt={bt} />
  }
}
