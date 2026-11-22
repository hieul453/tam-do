import { useState } from 'react'
import { Zap, BookOpen, Sprout, Target, ArrowRight } from 'lucide-react'
import { Nut } from '@/components/ui/Nut'
import { cn } from '@/lib/cn'
import { ghiCo } from '@/lib/kho-cuc-bo'
import { KHOA_DA_CHAO } from './khoa'
import { useDatMucTieu, useSoLieu, MUC_TIEU } from '@/features/tiendo/duLieu'

/**
 * Màn chào lần đầu.
 *
 * Ba màn, không hơn. Duolingo hỏi rất nhiều ở bước này vì họ cần phân luồng
 * trình độ; ở đây chưa có gì để phân luồng, nên chỉ giữ đúng ba việc đáng làm:
 *
 *   1. Nói app này là gì, trong một câu.
 *   2. Nói điểm khác biệt — ba hướng tiếp cận cho cùng một nội dung. Người
 *      không biết điều này sẽ bấm vào phần đầu tiên rồi tưởng đây là app thẻ
 *      lật thường.
 *   3. Chọn mục tiêu mỗi ngày. Hỏi ngay từ đầu thì con số ở thanh bên có nghĩa
 *      ngay từ phiên đầu tiên.
 *
 * Bỏ qua được ở mọi bước: ai muốn vào học luôn thì không nên bị chặn.
 */

const HUONG = [
  {
    icon: Zap,
    ten: 'Nhanh',
    moTa: 'Thẻ lật và câu hỏi ngắn. Vài phút là nắm ý chính.',
    mau: 'text-nhan-dam',
    nen: 'bg-nhan-nhat',
  },
  {
    icon: BookOpen,
    ten: 'Đào sâu',
    moTa: 'Nghiên cứu thật, dẫn nguồn đầy đủ. Hiểu vì sao chứ không chỉ biết.',
    mau: 'text-sau',
    nen: 'bg-sau-nhat',
  },
  {
    icon: Sprout,
    ten: 'Áp dụng',
    moTa: 'Đưa vào đời sống, có trợ lý AI gợi ý theo đúng chuyện của bạn.',
    mau: 'text-dung',
    nen: 'bg-dung-nhat',
  },
] as const

export function ManChao({ xong }: { xong: () => void }) {
  const [buoc, setBuoc] = useState(0)
  const { soLieu, luuDuoc } = useSoLieu()
  const datMucTieu = useDatMucTieu()

  function ketThuc() {
    ghiCo(KHOA_DA_CHAO, true)
    xong()
  }

  return (
    <div className="nen-cham flex min-h-dvh flex-col">
      {/* Chấm tiến độ và nút bỏ qua */}
      <header className="flex items-center justify-between px-5 py-5">
        <span className="flex gap-1.5" aria-label={`Bước ${buoc + 1} trên 3`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === buoc ? 'w-6 bg-nhan' : 'w-1.5 bg-vien-dam',
              )}
            />
          ))}
        </span>
        <button onClick={ketThuc} className="min-h-11 text-sm font-bold text-chu-mo hover:text-chu">
          Bỏ qua
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-6">
        {buoc === 0 && (
          <div className="text-center">
            <span
              className="mx-auto mb-6 grid size-20 place-items-center rounded-lon bg-nhan text-4xl font-bold text-white"
              aria-hidden
            >
              Ψ
            </span>
            <h1 className="text-3xl font-extrabold">Tâm Đồ</h1>
            <p className="mt-3 text-lg leading-relaxed text-chu-phu">
              Học tâm lý học bằng những phiên ngắn, mỗi ngày một ít. Hiểu chính mình và người xung
              quanh bằng thứ đã được nghiên cứu kiểm chứng.
            </p>
          </div>
        )}

        {buoc === 1 && (
          <div>
            <h1 className="text-2xl font-extrabold">Một nội dung, ba cách học</h1>
            <p className="mt-2 mb-6 text-chu-phu">
              Mỗi phần đều có đủ ba hướng. Không hướng nào là "đúng" — chọn theo việc bạn đang cần
              gì lúc đó.
            </p>
            <ul className="flex flex-col gap-3">
              {HUONG.map(({ icon: Icon, ten, moTa, mau, nen }) => (
                <li
                  key={ten}
                  className="flex items-start gap-3 rounded-lon border border-vien bg-nen p-4"
                >
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-vua', nen)}>
                    <Icon className={cn('size-6', mau)} strokeWidth={2.2} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-extrabold">{ten}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-chu-phu">
                      {moTa}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {buoc === 2 && (
          <div>
            <Target className="mb-4 size-10 text-nhan-dam" strokeWidth={2} aria-hidden />
            <h1 className="text-2xl font-extrabold">Mỗi ngày bao nhiêu là vừa?</h1>
            <p className="mt-2 mb-6 text-chu-phu">
              Chọn mức bạn giữ được đều, không phải mức cao nhất. Đều đặn mới thành chuỗi — đổi lại
              lúc nào cũng được.
            </p>
            <ul className="flex flex-col gap-2.5">
              {MUC_TIEU.map((xp) => {
                const dangChon = soLieu.mucTieuXpNgay === xp
                return (
                  <li key={xp}>
                    <button
                      type="button"
                      disabled={!luuDuoc || datMucTieu.isPending}
                      aria-pressed={dangChon}
                      onClick={() => datMucTieu.mutate(xp)}
                      className={cn(
                        'flex min-h-14 w-full items-center justify-between rounded-lon border-2 px-4 text-left transition-colors disabled:opacity-60',
                        dangChon ? 'border-nhan bg-nhan-nhat' : 'border-vien hover:bg-nen-dju',
                      )}
                    >
                      <span className={cn('font-extrabold', dangChon && 'text-nhan-dam')}>
                        {xp} XP mỗi ngày
                      </span>
                      <span className="text-sm text-chu-phu">
                        {xp <= 10
                          ? 'thong thả'
                          : xp <= 20
                            ? 'vừa phải'
                            : xp <= 30
                              ? 'chăm'
                              : 'rất chăm'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {!luuDuoc && (
              <p className="mt-3 text-xs text-chu-mo">
                Máy chủ lưu trữ chưa được cấu hình, nên mục tiêu chưa lưu được.
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="px-5 pb-6" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto w-full max-w-md">
          <Nut co="lon" onClick={() => (buoc === 2 ? ketThuc() : setBuoc((b) => b + 1))}>
            {buoc === 2 ? 'Bắt đầu học' : 'Tiếp tục'}
            {buoc < 2 && <ArrowRight className="size-4" aria-hidden />}
          </Nut>
        </div>
      </footer>
    </div>
  )
}
