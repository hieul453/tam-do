import { Link } from 'react-router'
import * as Icons from 'lucide-react'
import { Check, Lock, Star } from 'lucide-react'
import { cacNhanh, type Chuong, type Nhanh, type Phan } from '@/content'
import { The, Huy } from '@/components/ui/co-ban'
import { cn } from '@/lib/cn'
import { useSoLieu, soHuongDaXong, khoaPhan, type SoLieuHoc } from '@/features/tiendo/duLieu'

/**
 * Màn hình lộ trình — màn hình chính của app.
 *
 * Mượn cấu trúc đã được Duolingo chứng minh: một con đường dọc, uốn nhẹ, mỗi
 * chặng là một nút tròn; tiêu đề chương dính ở trên khi cuộn. Lý do nó hiệu
 * quả: người học luôn thấy đúng MỘT việc tiếp theo, và thấy con đường còn dài
 * bao nhiêu mà không phải mở menu.
 *
 * Khác Duolingo: họ dùng con đường để tạo cảm giác tiến lên trong một khoá
 * tuyến tính. Ở đây nội dung không tuyến tính chặt như ngữ pháp, nên các phần
 * đã mở đều vào được — con đường là bản đồ, không phải hàng rào.
 */

/** Độ lệch ngang lặp lại, tạo đường uốn mà không cần tính toán phức tạp. */
const LECH = [0, 38, 58, 38, 0, -38, -58, -38]

function IconNhanh({ ten, className }: { ten: string; className?: string }) {
  const Co = (Icons as unknown as Record<string, Icons.LucideIcon>)[ten] ?? Icons.Circle
  return <Co className={className} strokeWidth={2.2} aria-hidden />
}

/* ─────────────────────────────── Một chặng ──────────────────────────────── */

/**
 * Bốn dáng vẻ cho bốn trạng thái. Minimalism không có nghĩa là bỏ màu, mà là
 * chỉ dùng màu khi nó mang nghĩa: nhìn con đường phải biết ngay mình đang ở
 * đâu, đã qua gì, còn gì khoá — không cần đọc chữ.
 */
type Dang = 'xong' | 'hien-tai' | 'mo' | 'khoa'

const DANG: Record<Dang, { vong: string; icon: string }> = {
  xong: { vong: 'border-[#0f6f45] bg-dung text-white', icon: 'text-white' },
  'hien-tai': { vong: 'border-nhan-dam bg-nhan text-white', icon: 'text-white' },
  mo: { vong: 'border-vien-dam bg-nen text-nhan-dam', icon: 'text-nhan-dam' },
  khoa: { vong: 'border-vien bg-nen-chim text-chu-mo', icon: 'text-chu-mo' },
}

/** Bao nhiêu hướng tiếp cận thực sự có nội dung ở phần này. */
function tongHuongCua(phan: Phan) {
  return [Boolean(phan.nhanh?.length), Boolean(phan.daoSau), Boolean(phan.apDung)].filter(Boolean)
    .length
}

/**
 * Vành tiến độ quanh chặng: đã xong mấy trên mấy hướng.
 *
 * Duolingo dùng vành này cho "crown" của họ. Ở đây nó trả lời đúng câu hỏi
 * người học hay có khi quay lại: phần này mình còn cách nào chưa thử. Chỉ vẽ
 * khi đang dở — xong hẳn thì đã có dấu tích, chưa làm gì thì chẳng có gì để vẽ.
 */
function VanhTienDo({ xong, tong }: { xong: number; tong: number }) {
  const r = 41
  const chuVi = 2 * Math.PI * r
  return (
    <svg
      viewBox="0 0 86 86"
      className="pointer-events-none absolute -inset-[7px] -rotate-90"
      aria-hidden
    >
      <circle cx="43" cy="43" r={r} fill="none" strokeWidth="3" className="stroke-vien" />
      <circle
        cx="43"
        cy="43"
        r={r}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-dung"
        strokeDasharray={`${(chuVi * xong) / tong} ${chuVi}`}
      />
    </svg>
  )
}

function NutChang({
  phan,
  duongDan,
  dang,
  xong,
  tong,
}: {
  phan: Phan
  duongDan: string
  dang: Dang
  xong: number
  tong: number
}) {
  const moDuoc = dang !== 'khoa'
  const kieu = DANG[dang]
  const dangDo = dang !== 'khoa' && dang !== 'xong' && xong > 0 && xong < tong

  const than = (
    <span className="relative inline-grid">
      {dangDo && <VanhTienDo xong={xong} tong={tong} />}
      <span
        className={cn(
          'grid size-[4.5rem] place-items-center rounded-full border-2 border-b-[6px] transition-transform',
          kieu.vong,
          moDuoc && 'active:translate-y-[6px] active:border-b-2',
        )}
      >
        {dang === 'xong' ? (
          <Check className={cn('size-8', kieu.icon)} strokeWidth={3} aria-hidden />
        ) : dang === 'khoa' ? (
          <Lock className={cn('size-6', kieu.icon)} strokeWidth={2.4} aria-hidden />
        ) : (
          <Star
            className={cn('size-8', kieu.icon, dang === 'hien-tai' && 'fill-white/30')}
            strokeWidth={2.4}
            aria-hidden
          />
        )}
      </span>
    </span>
  )

  const nhanDocLen =
    dang === 'xong'
      ? `${phan.tieuDe} — đã xong cả ${tong} cách`
      : dangDo
        ? `${phan.tieuDe} — đã xong ${xong} trên ${tong} cách`
        : phan.tieuDe

  return (
    <li className="flex flex-col items-center">
      {dang === 'hien-tai' && (
        <span className="mb-2 animate-bounce rounded-vua border-2 border-vien bg-nen px-3 py-1 text-xs font-extrabold tracking-wide text-nhan-dam uppercase">
          {xong > 0 ? 'Học tiếp' : 'Bắt đầu'}
        </span>
      )}

      {moDuoc ? (
        <Link to={duongDan} className="group flex flex-col items-center" aria-label={nhanDocLen}>
          {than}
          <span
            className={cn(
              'mt-2 max-w-[11rem] text-center text-sm font-bold group-hover:text-nhan-dam',
              dang === 'mo' && 'text-chu-phu',
            )}
          >
            {phan.tieuDe}
          </span>
          {dangDo && (
            <span className="mt-0.5 text-xs tabular-nums text-chu-mo">
              {xong}/{tong} cách
            </span>
          )}
        </Link>
      ) : (
        <span className="flex flex-col items-center">
          {than}
          <span className="mt-2 max-w-[11rem] text-center text-sm font-bold text-chu-mo">
            {phan.tieuDe}
          </span>
          <Huy className="mt-1">Sắp có</Huy>
        </span>
      )}
    </li>
  )
}

/* ─────────────────────────────── Một chương ─────────────────────────────── */

function KhoiChuong({
  nhanh,
  chuong,
  soThuTu,
  soLieu,
}: {
  nhanh: Nhanh
  chuong: Chuong
  soThuTu: number
  soLieu: SoLieuHoc
}) {
  const mo = chuong.trangThai === 'mo'

  // Mỗi chặng biết mình đã xong mấy hướng. Tính một lần ở đây để còn biết
  // chặng nào là "đang ở đây".
  const chang = chuong.phan.map((phan) => {
    const tong = tongHuongCua(phan)
    const xong = soHuongDaXong(soLieu, khoaPhan(nhanh.id, chuong.id, phan.id))
    return { phan, tong, xong: Math.min(xong, tong) }
  })

  // "Đang ở đây" là chặng mở đầu tiên chưa xong hết. Xong hết cả chương thì
  // không chặng nào được gắn nhãn — không giục người ta làm lại.
  const dangODay = chang.find((c) => c.phan.trangThai === 'mo' && c.xong < c.tong)?.phan.id

  const xongChuong = chang.filter((c) => c.tong > 0 && c.xong === c.tong).length
  const tongChuong = chang.filter((c) => c.phan.trangThai === 'mo').length

  return (
    <section className="mb-10">
      <header
        className={cn(
          'sticky top-[3.6rem] z-10 mb-8 rounded-vua px-4 py-3 lg:top-4',
          mo ? 'bg-nhan text-white' : 'border border-vien bg-nen-dju text-chu-phu',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-extrabold tracking-[0.12em] uppercase opacity-90">
              Chương {soThuTu}
            </p>
            <h2 className="text-lg font-extrabold">{chuong.tieuDe}</h2>
          </div>
          {mo && tongChuong > 0 && (
            <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-extrabold tabular-nums">
              {xongChuong}/{tongChuong}
            </span>
          )}
        </div>
        <p className={cn('text-sm', mo ? 'text-white/85' : 'text-chu-mo')}>{chuong.cauHoi}</p>
      </header>

      {mo ? (
        <ol className="flex flex-col items-center gap-7">
          {chang.map(({ phan, xong, tong }, i) => (
            <div key={phan.id} style={{ transform: `translateX(${LECH[i % LECH.length]}px)` }}>
              <NutChang
                phan={phan}
                duongDan={`/phan/${nhanh.id}/${chuong.id}/${phan.id}`}
                xong={xong}
                tong={tong}
                dang={
                  phan.trangThai !== 'mo'
                    ? 'khoa'
                    : tong > 0 && xong === tong
                      ? 'xong'
                      : phan.id === dangODay
                        ? 'hien-tai'
                        : 'mo'
                }
              />
            </div>
          ))}
        </ol>
      ) : (
        <p className="rounded-vua border border-dashed border-vien px-4 py-6 text-center text-sm text-chu-mo">
          Nội dung chương này đang được soạn.
        </p>
      )}
    </section>
  )
}

/* ──────────────────────────────── Trang ─────────────────────────────────── */

export function TrangLoTrinh() {
  const { soLieu } = useSoLieu()
  const mo = cacNhanh.filter((n) => n.trangThai === 'mo')
  const sapCo = cacNhanh.filter((n) => n.trangThai !== 'mo')

  return (
    <div className="nen-cham -mx-4 px-4 lg:-mx-8 lg:px-8">
      {mo.map((nhanh) => (
        <div key={nhanh.id}>
          <div className="mb-6 flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-vua bg-nhan-nhat text-nhan-dam">
              <IconNhanh ten={nhanh.icon} className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold">{nhanh.tieuDe}</h1>
              <p className="text-sm text-chu-phu">{nhanh.moTa}</p>
            </div>
          </div>

          {nhanh.chuong.map((chuong, i) => (
            <KhoiChuong
              key={chuong.id}
              nhanh={nhanh}
              chuong={chuong}
              soThuTu={i + 1}
              soLieu={soLieu}
            />
          ))}
        </div>
      ))}

      <section className="mt-4 mb-2">
        <h2 className="mb-1 text-base font-extrabold">Các nhánh khác</h2>
        <p className="mb-4 text-sm text-chu-phu">
          Bản thử nghiệm mở một nhánh. Những nhánh dưới đây đang được soạn.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sapCo.map((nhanh) => (
            <li key={nhanh.id}>
              <The className="flex h-full items-start gap-3 bg-nen-dju">
                <span className="grid size-10 shrink-0 place-items-center rounded-vua bg-nen text-chu-mo">
                  <IconNhanh ten={nhanh.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-chu-phu">{nhanh.tieuDe}</span>
                    <Huy>Sắp có</Huy>
                  </span>
                  <span className="mt-0.5 block text-sm text-chu-mo">{nhanh.moTa}</span>
                </span>
              </The>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 flex items-center justify-center gap-1.5 pb-4 text-xs text-chu-mo">
        <Check className="size-3.5" aria-hidden />
        Mọi số liệu nghiên cứu trong bài đều dẫn nguồn kiểm chứng được
      </p>
    </div>
  )
}
