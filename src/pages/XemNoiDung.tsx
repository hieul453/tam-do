import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { marked } from 'marked'
import { ArrowLeft, BookOpen, Palette, Clock, Tag } from 'lucide-react'
import { cacChuong, soLieu, type Bai } from '@/content'
import type { LoaiThe, NhanBai } from '@/content/schema'

/**
 * Trang xem trước nội dung — CÔNG CỤ, KHÔNG PHẢI GIAO DIỆN THẬT.
 *
 * Mục đích: người soạn nội dung sửa `content/*.md`, mở trang này (hoặc link
 * preview của pull request) và thấy ngay markdown của mình được đọc ra thành
 * gì. Nếu một mục hiện ra trống hoặc sai chỗ, nghĩa là markdown viết lệch
 * khuôn — biết ngay thay vì đợi tới lúc dựng giao diện thật.
 *
 * Giao diện thật của bài học (3 tab, thẻ vuốt, linh vật) làm sau, theo bản
 * thiết kế đã duyệt.
 */

const TEN_NHAN: Record<NhanBai, string> = {
  'trong-tam': 'Trọng tâm',
  'mo-rong': 'Mở rộng',
  'da-cap-nhat': 'Đã cập nhật',
  'viet-nam': 'Riêng Việt Nam',
}

const MAU_NHAN: Record<NhanBai, string> = {
  'trong-tam': 'bg-xanh-xo-thom/20 text-xanh-xo-thom',
  'mo-rong': 'bg-oai-huong/25 text-oai-huong',
  'da-cap-nhat': 'bg-vang-bo/50 text-hong-dam',
  'viet-nam': 'bg-dao/30 text-hong-dam',
}

const TEN_LOAI_THE: Record<LoaiThe, string> = {
  'doan-thu': 'Đoán thử',
  'y-chinh': 'Ý chính',
  hinh: 'Thẻ hình',
  'tuong-tac': 'Tương tác',
  'vi-du': 'Ví dụ',
  'kiem-tra': 'Kiểm tra',
}

function Khung({ children, tieuDe }: { children: React.ReactNode; tieuDe: string }) {
  return (
    <section className="mb-4 rounded-the bg-white/70 p-5 shadow-mem backdrop-blur-sm">
      <h2 className="mb-3 text-lg text-ca-cao">{tieuDe}</h2>
      {children}
    </section>
  )
}

/** Nội dung đến từ file markdown trong repo, đã qua review pull request, nên tin được. */
function Markdown({ nguon }: { nguon: string }) {
  const html = useMemo(() => marked.parse(nguon, { async: false }) as string, [nguon])
  return (
    <div
      className="prose-tamdo text-[0.95rem] leading-relaxed text-ca-cao"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function MotBai({ bai, onDong }: { bai: Bai; onDong: () => void }) {
  return (
    <div>
      <button
        onClick={onDong}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-hong-dam"
      >
        <ArrowLeft className="size-4" aria-hidden /> Quay lại danh sách
      </button>

      <header className="mb-5">
        <p className="font-mono text-xs text-ca-cao-nhat">
          {bai.so} · {bai.id}
        </p>
        <h1 className="mt-1 text-2xl text-ca-cao">{bai.tieuDe}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {bai.nhan.map((n) => (
            <span key={n} className={`rounded-full px-2.5 py-1 text-xs font-medium ${MAU_NHAN[n]}`}>
              {TEN_NHAN[n]}
            </span>
          ))}
          {bai.daoSau.phutDoc && (
            <span className="flex items-center gap-1 text-xs text-ca-cao-nhat">
              <Clock className="size-3.5" aria-hidden /> {bai.daoSau.phutDoc} phút đọc
            </span>
          )}
        </div>
      </header>

      <Khung tieuDe={`⚡ Hiểu nhanh — ${bai.hieuNhanh.length} thẻ`}>
        <ol className="space-y-3">
          {bai.hieuNhanh.map((t, i) => (
            <li key={t.id} className="rounded-the-nho bg-kem-hong/70 p-3.5">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-ca-cao-nhat">{i + 1}</span>
                <span className="rounded-full bg-hong-phan/30 px-2 py-0.5 text-xs font-medium text-hong-dam">
                  {TEN_LOAI_THE[t.loai]}
                </span>
                <span className="text-sm font-semibold text-ca-cao">{t.nhan}</span>
              </div>
              <Markdown nguon={t.noiDung} />
            </li>
          ))}
        </ol>
      </Khung>

      <Khung tieuDe="📖 Đào sâu">
        <p className="mb-4 rounded-the-nho bg-vang-bo/30 p-3 text-sm italic text-ca-cao">
          Đọc xong bạn sẽ hiểu: {bai.daoSau.seHieu}
        </p>
        <Markdown nguon={bai.daoSau.than} />

        {bai.daoSau.cauChuyen.length > 0 && (
          <div className="mt-5 border-t border-hong-phan/25 pt-4">
            <p className="mb-2 text-sm font-semibold text-ca-cao-nhat">
              Đọc ra được {bai.daoSau.cauChuyen.length} câu chuyện nghiên cứu
            </p>
            <ul className="space-y-1 text-sm text-ca-cao-nhat">
              {bai.daoSau.cauChuyen.map((c, i) => (
                <li key={i}>
                  <span className="font-medium text-ca-cao">{c.tieuDe}</span>
                  {c.nghiaLa ? ' · có câu "Nghĩa là"' : ' · THIẾU câu "Nghĩa là"'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 border-t border-hong-phan/25 pt-4">
          <p className="mb-2 text-sm font-semibold text-ca-cao">3 điều cần nhớ</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {bai.daoSau.baDieuCanNho.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ol>
        </div>

        <details className="mt-4 rounded-the-nho bg-kem-hong/70 p-3.5">
          <summary className="cursor-pointer text-sm font-semibold text-hong-dam">
            Mở rộng — thuật ngữ, liên kết, nguồn
          </summary>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-ca-cao">Thuật ngữ ({bai.daoSau.thuatNgu.length})</dt>
              <dd className="text-ca-cao-nhat">
                {bai.daoSau.thuatNgu.map((t) => `${t.vi}${t.en ? ` (${t.en})` : ''}`).join(' · ')}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ca-cao">Liên kết môn khác</dt>
              <dd className="text-ca-cao-nhat">{bai.daoSau.lienKet.join(' · ') || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-ca-cao">Nguồn ({bai.daoSau.nguon.length})</dt>
              <dd>
                <ul className="space-y-1">
                  {bai.daoSau.nguon.map((n, i) => (
                    <li key={i}>
                      {n.url ? (
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-hong-dam underline"
                        >
                          {n.ten}
                        </a>
                      ) : (
                        <span className="text-ca-cao-nhat">{n.ten}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </details>
      </Khung>

      <Khung tieuDe="🌱 Áp dụng">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-ca-cao">{bai.apDung.thuThach.nhan}</dt>
            <dd className="text-ca-cao-nhat">{bai.apDung.thuThach.noiDung}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ca-cao">Câu hỏi tự soi</dt>
            <dd className="text-ca-cao-nhat">{bai.apDung.tuSoi}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ca-cao">Dùng ngay</dt>
            <dd className="text-ca-cao-nhat">{bai.apDung.dungNgay}</dd>
          </div>
          {bai.apDung.timChuyenGia && (
            <div className="rounded-the-nho bg-vang-bo/40 p-3">
              <dt className="font-semibold text-ca-cao">Khi nào nên tìm chuyên gia</dt>
              <dd className="text-ca-cao-nhat">{bai.apDung.timChuyenGia}</dd>
            </div>
          )}
        </dl>
      </Khung>

      <Khung tieuDe={`🎨 Minh họa cần vẽ — ${bai.minhHoa.length} hình`}>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ca-cao-nhat">
          {bai.minhHoa.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ol>
      </Khung>
    </div>
  )
}

export function XemNoiDung() {
  const [idBai, setIdBai] = useState<string | null>(null)

  const baiDangXem = useMemo(() => {
    if (!idBai) return null
    for (const c of cacChuong) {
      const b = c.bai.find((x) => x.id === idBai)
      if (b) return b
    }
    return null
  }, [idBai])

  return (
    <main className="nen-mang-mau min-h-dvh px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-the-nho border border-hong-phan/40 bg-white/60 p-3.5 text-sm text-ca-cao-nhat">
          <strong className="text-ca-cao">Trang xem trước nội dung.</strong> Đây là công cụ để kiểm
          tra markdown đã được đọc đúng chưa, <em>không phải</em> giao diện thật của app. Mục nào
          hiện ra trống hoặc sai chỗ nghĩa là file markdown viết lệch khuôn.
        </div>

        {baiDangXem ? (
          <MotBai bai={baiDangXem} onDong={() => setIdBai(null)} />
        ) : (
          <>
            <header className="mb-6">
              <p className="font-than text-sm uppercase tracking-wide text-ca-cao-nhat">Tâm Đồ</p>
              <h1 className="mt-1 text-3xl text-ca-cao">Nội dung đã có</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ca-cao-nhat">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-4" aria-hidden /> {soLieu.chuong} chương · {soLieu.bai}{' '}
                  bài
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="size-4" aria-hidden /> {soLieu.the} thẻ
                </span>
                <span className="flex items-center gap-1.5">
                  <Palette className="size-4" aria-hidden /> {soLieu.minhHoaCanVe} hình cần vẽ
                </span>
              </div>
            </header>

            {cacChuong.length === 0 && (
              <p className="rounded-the bg-white/70 p-5 text-ca-cao-nhat shadow-mem">
                Chưa có nội dung nào. Chạy{' '}
                <code className="text-hong-dam">npm run content:build</code>.
              </p>
            )}

            {cacChuong.map((c) => (
              <section
                key={c.id}
                className="mb-4 rounded-the bg-white/70 p-5 shadow-mem backdrop-blur-sm"
              >
                <h2 className="text-xl text-ca-cao">
                  Chương {c.so} — {c.tieuDe}
                </h2>
                <p className="mt-1 mb-4 text-sm italic text-ca-cao-nhat">{c.cauHoiChuong}</p>
                <ul className="space-y-2">
                  {c.bai.map((b) => (
                    <li key={b.id}>
                      <button
                        onClick={() => setIdBai(b.id)}
                        className="flex w-full items-start gap-3 rounded-the-nho bg-kem-hong/70 p-3 text-left transition-colors hover:bg-hong-phan/20"
                      >
                        <span className="mt-0.5 font-mono text-xs text-ca-cao-nhat">{b.so}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-ca-cao">{b.tieuDe}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-1.5">
                            {b.nhan.map((n) => (
                              <span
                                key={n}
                                className={`rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${MAU_NHAN[n]}`}
                              >
                                {TEN_NHAN[n]}
                              </span>
                            ))}
                            <span className="text-xs text-ca-cao-nhat">
                              {b.hieuNhanh.length} thẻ · {b.daoSau.phutDoc} phút ·{' '}
                              {b.minhHoa.length} hình
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-hong-dam underline">
            Về trang Kiểm tra hạ tầng
          </Link>
        </p>
      </div>
    </main>
  )
}
