import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Brain, Dumbbell, Trophy, User, Flame, Heart, Zap, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { The, ThanhTienDo, ChiSo } from '@/components/ui/co-ban'
import { Nut } from '@/components/ui/Nut'
import { useAuth } from '@/lib/auth'
import { useSoLieu } from '@/features/tiendo/duLieu'

/**
 * Hai bố cục khác nhau cho cùng một nội dung, theo đúng cách Duolingo làm:
 *
 *   Web (≥1024px)   thanh điều hướng DỌC bên trái · nội dung giữa ·
 *                   cột phải chứa số liệu và nhắc nhở
 *   Mobile (<1024)  thanh số liệu mỏng trên cùng · nội dung ·
 *                   thanh tab NGANG dưới cùng
 *
 * Chuyển bằng CSS chứ không bằng JS: không có nhấp nháy lúc tải, không phải
 * nghe sự kiện resize, và chỉ có một cây DOM nên không lệch trạng thái.
 * Cái giá là cả hai thanh điều hướng đều nằm trong DOM — chấp nhận được vì
 * chúng rất nhẹ.
 */

const MUC = [
  { den: '/', nhan: 'Học', icon: Brain },
  { den: '/luyen-tap', nhan: 'Luyện tập', icon: Dumbbell },
  { den: '/thanh-tich', nhan: 'Thành tích', icon: Trophy },
  { den: '/toi', nhan: 'Tôi', icon: User },
] as const

/**
 * Ba con số của thanh bên.
 *
 * Chưa tải xong thì hiện gạch ngang chứ không hiện 0: thấy 0 rồi nhảy thành 7
 * làm người ta tưởng vừa mất chuỗi. Màu cũng mang nghĩa — ngọn lửa xám khi
 * chuỗi bằng 0, trái tim rỗng khi hết tim.
 */
function BaChiSo({ doc = false }: { doc?: boolean }) {
  const { soLieu, sanSang } = useSoLieu()
  const so = (n: number) => (sanSang ? n : '–')

  return (
    <div className={cn('flex items-center', doc ? 'justify-between' : 'gap-4')}>
      <ChiSo
        icon={<Flame className={cn('size-5', soLieu.chuoi > 0 && 'fill-vang')} />}
        giaTri={so(soLieu.chuoi)}
        nhan="chuỗi ngày học liên tiếp"
        mau={soLieu.chuoi > 0 ? 'text-vang' : 'text-chu-mo'}
      />
      <ChiSo
        icon={<Zap className="size-5" />}
        giaTri={so(soLieu.xpHomNay)}
        nhan="điểm kinh nghiệm hôm nay"
        mau="text-nhan-dam"
      />
      <ChiSo
        icon={<Heart className={cn('size-5', soLieu.tim > 0 && 'fill-sai')} />}
        giaTri={so(soLieu.tim)}
        nhan="tim còn lại"
        mau={soLieu.tim > 0 ? 'text-sai' : 'text-chu-mo'}
      />
    </div>
  )
}

function LogoTamDo({ gon = false }: { gon?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-vua bg-nhan font-bold text-white"
        aria-hidden
      >
        Ψ
      </span>
      {!gon && <span className="text-lg font-extrabold tracking-tight">Tâm Đồ</span>}
    </span>
  )
}

/* ───────────────────────────── Web: sidebar trái ────────────────────────── */

function SidebarWeb() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[15rem] shrink-0 flex-col gap-1 border-r border-vien px-4 py-6 lg:flex xl:w-[16.5rem]">
      <div className="mb-6 px-2">
        <LogoTamDo />
      </div>
      <nav className="flex flex-col gap-1" aria-label="Điều hướng chính">
        {MUC.map(({ den, nhan, icon: Icon }) => (
          <NavLink
            key={den}
            to={den}
            end={den === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-vua border-2 px-3 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors',
                isActive
                  ? 'border-nhan/40 bg-nhan-nhat text-nhan-dam'
                  : 'border-transparent text-chu-phu hover:bg-nen-dju',
              )
            }
          >
            <Icon className="size-5 shrink-0" strokeWidth={2.2} aria-hidden />
            {nhan}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

/* ───────────────────────────── Web: cột phải ────────────────────────────── */

function RailWeb() {
  const { soLieu, sanSang, luuDuoc } = useSoLieu()
  const { laAnDanh, dangTai, lienKetGoogle } = useAuth()
  const datMucTieu = soLieu.xpHomNay >= soLieu.mucTieuXpNgay

  return (
    <aside className="sticky top-0 hidden h-dvh w-[20rem] shrink-0 flex-col gap-4 overflow-y-auto border-l border-vien px-5 py-6 xl:flex">
      <BaChiSo doc />

      <The nhan={datMucTieu}>
        <h2 className="flex items-center gap-1.5 text-sm font-bold">
          Mục tiêu hôm nay
          {datMucTieu && <Check className="size-4 text-dung" strokeWidth={3} aria-hidden />}
        </h2>
        <p className="mt-1 mb-3 text-sm text-chu-phu">
          {sanSang ? `${soLieu.xpHomNay} / ${soLieu.mucTieuXpNgay} XP` : 'Đang tải…'}
        </p>
        <ThanhTienDo
          giaTri={soLieu.xpHomNay}
          tong={soLieu.mucTieuXpNgay}
          mau={datMucTieu ? 'dung' : 'nhan'}
          nhan="tiến độ mục tiêu hôm nay"
        />
        {datMucTieu && (
          <p className="mt-2 text-xs font-bold text-dung">
            Xong mục tiêu. Học thêm vẫn được tính XP.
          </p>
        )}
      </The>

      {soLieu.chuoiDaiNhat > soLieu.chuoi && (
        <The>
          <h2 className="text-sm font-bold">Chuỗi dài nhất</h2>
          <p className="mt-1 text-sm text-chu-phu">
            {soLieu.chuoiDaiNhat} ngày. Hôm nay là cơ hội để vượt.
          </p>
        </The>
      )}

      {!dangTai && laAnDanh && (
        <The>
          <h2 className="text-sm font-bold">Giữ tiến độ của bạn</h2>
          <p className="mt-1 mb-3 text-sm text-chu-phu">
            Bạn đang học ẩn danh. Liên kết tài khoản để không mất gì khi đổi máy.
          </p>
          <Nut kieu="vien" co="lon" className="text-xs" onClick={() => void lienKetGoogle()}>
            Liên kết tài khoản
          </Nut>
        </The>
      )}

      {!luuDuoc && !dangTai && (
        <The className="bg-nen-dju">
          <p className="text-xs leading-relaxed text-chu-phu">
            Máy chủ lưu trữ chưa được cấu hình, nên tiến độ của phiên này không được lưu.
          </p>
        </The>
      )}

      <p className="mt-auto text-xs leading-relaxed text-chu-mo">
        Tâm Đồ là công cụ học tập, không thay thế chẩn đoán hay trị liệu.
      </p>
    </aside>
  )
}

/* ───────────────────────── Mobile: thanh trên và dưới ───────────────────── */

function ThanhTrenMobile() {
  const { soLieu, sanSang } = useSoLieu()
  return (
    <header className="sticky top-0 z-20 border-b border-vien bg-nen/90 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <LogoTamDo gon />
        <BaChiSo />
      </div>
      {/* Mobile không có cột phải, nên mục tiêu ngày nằm thành một vạch mảnh
          ngay dưới thanh số liệu — vẫn thấy, mà không chiếm chỗ của nội dung. */}
      {sanSang && (
        <ThanhTienDo
          giaTri={soLieu.xpHomNay}
          tong={soLieu.mucTieuXpNgay}
          mau={soLieu.xpHomNay >= soLieu.mucTieuXpNgay ? 'dung' : 'nhan'}
          className="h-1 rounded-none"
          nhan={`mục tiêu hôm nay: ${soLieu.xpHomNay} trên ${soLieu.mucTieuXpNgay} XP`}
        />
      )}
    </header>
  )
}

function TabDuoiMobile() {
  return (
    <nav
      className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-vien bg-nen/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Điều hướng chính"
    >
      {MUC.map(({ den, nhan, icon: Icon }) => (
        <NavLink
          key={den}
          to={den}
          end={den === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 py-2.5 text-[0.68rem] font-bold tracking-wide uppercase transition-colors',
              isActive ? 'text-nhan-dam' : 'text-chu-mo',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="size-6" strokeWidth={isActive ? 2.6 : 2} aria-hidden />
              {nhan}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/* ──────────────────────────────── Khung ─────────────────────────────────── */

export function Khung({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  // Phiên học chiếm trọn màn hình: không sidebar, không tab — giống Duolingo,
  // để người học không bị thứ gì kéo ra khỏi bài.
  const toanManHinh = pathname.startsWith('/hoc/')
  if (toanManHinh) return <>{children}</>

  return (
    <div className="flex min-h-dvh">
      <SidebarWeb />
      <div className="flex min-w-0 flex-1 flex-col">
        <ThanhTrenMobile />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 lg:px-8 lg:py-10">
          {children}
        </main>
        <TabDuoiMobile />
      </div>
      <RailWeb />
    </div>
  )
}
