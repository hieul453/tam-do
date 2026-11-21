import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CircleCheck, CircleAlert, CircleDashed, ArrowRight, LogIn, LogOut } from 'lucide-react'
import { supabase, daCauHinhSupabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { soLieu } from '@/content'

type Trangthai = 'dang-kiem' | 'ok' | 'loi' | 'chua-cau-hinh'

const MAU = [
  ['Kem hồng', 'bg-kem-hong', '#FFF6F1'],
  ['Hồng san hô', 'bg-san-ho', '#F2788A'],
  ['Hồng đậm', 'bg-hong-dam', '#C24D63'],
  ['Hồng phấn', 'bg-hong-phan', '#F7A8B6'],
  ['Đào', 'bg-dao', '#FFB38A'],
  ['Vàng bơ', 'bg-vang-bo', '#FFE3B0'],
  ['Xanh xô thơm', 'bg-xanh-xo-thom', '#7FA88B'],
  ['Oải hương', 'bg-oai-huong', '#B7A6EC'],
  ['Mận chín', 'bg-man-chin', '#6E3443'],
  ['Nâu ca cao', 'bg-ca-cao', '#3D2A2E'],
] as const

function Dong({
  nhan,
  trangthai,
  chuThich,
}: {
  nhan: string
  trangthai: Trangthai
  chuThich?: string
}) {
  const Icon =
    trangthai === 'ok' ? CircleCheck : trangthai === 'dang-kiem' ? CircleDashed : CircleAlert
  const mau =
    trangthai === 'ok'
      ? 'text-xanh-xo-thom'
      : trangthai === 'dang-kiem'
        ? 'text-ca-cao-nhat'
        : 'text-hong-dam'

  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className={`mt-0.5 size-5 shrink-0 ${mau}`} strokeWidth={2} aria-hidden />
      <div className="min-w-0">
        <p className="font-medium">{nhan}</p>
        {chuThich && <p className="text-sm text-ca-cao-nhat break-words">{chuThich}</p>}
      </div>
    </div>
  )
}

export function KiemTraHaTang() {
  const { session, dangTai, laAnDanh, lienKetGoogle, dangXuat } = useAuth()
  const [db, setDb] = useState<Trangthai>('dang-kiem')
  const [dbChuThich, setDbChuThich] = useState<string>()
  const [loiDangNhap, setLoiDangNhap] = useState<string>()
  const [dangChuyen, setDangChuyen] = useState(false)

  async function bamLienKet() {
    setLoiDangNhap(undefined)
    setDangChuyen(true)
    try {
      // Thành công thì trình duyệt rời trang sang Google, nên không cần tắt cờ.
      await lienKetGoogle()
    } catch (e) {
      setDangChuyen(false)
      setLoiDangNhap(e instanceof Error ? e.message : 'Không mở được đăng nhập Google')
    }
  }

  useEffect(() => {
    if (!daCauHinhSupabase) {
      setDb('chua-cau-hinh')
      setDbChuThich('Chưa có VITE_SUPABASE_URL trong .env.local')
      return
    }
    if (!session) return

    supabase
      .from('profiles')
      .select('id, timezone, daily_goal_minutes')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setDb('loi')
          setDbChuThich(error.message)
        } else if (!data) {
          setDb('loi')
          setDbChuThich('Kết nối được nhưng chưa có dòng profiles — migration chưa chạy?')
        } else {
          setDb('ok')
          setDbChuThich(`Đọc được profiles của mình · múi giờ ${data.timezone}`)
        }
      })
  }, [session])

  const trangThaiAuth: Trangthai = dangTai
    ? 'dang-kiem'
    : !daCauHinhSupabase
      ? 'chua-cau-hinh'
      : session
        ? 'ok'
        : 'loi'

  return (
    <main className="nen-mang-mau min-h-dvh px-4 py-10">
      <div className="mx-auto max-w-lg">
        <header className="mb-8">
          <p className="font-than text-sm tracking-wide text-ca-cao-nhat uppercase">Tâm Đồ</p>
          <h1 className="mt-1 text-3xl text-ca-cao">Kiểm tra hạ tầng</h1>
          <p className="mt-2 text-ca-cao-nhat">
            Trang này không phải tính năng. Nó chỉ xác nhận stack đã chạy đúng trước khi bắt đầu làm
            app.
          </p>
        </header>

        <section className="mb-5 rounded-the bg-white/70 p-5 shadow-mem backdrop-blur-sm">
          <h2 className="mb-1 text-xl">Kết nối</h2>
          <div className="divide-y divide-hong-phan/25">
            <Dong
              nhan="React + Vite + TypeScript"
              trangthai="ok"
              chuThich="Trang này render được nghĩa là xong"
            />
            <Dong
              nhan="Tailwind v4 và design token"
              trangthai="ok"
              chuThich="Màu, bo góc, bóng đổ bên dưới lấy từ token"
            />
            <Dong
              nhan="Phông chữ Lora và Be Vietnam Pro"
              trangthai="ok"
              chuThich="Tiêu đề có chân, nội dung không chân — đủ dấu tiếng Việt"
            />
            <Dong
              nhan="Phiên đăng nhập Supabase"
              trangthai={trangThaiAuth}
              chuThich={
                dangTai
                  ? 'Đang tạo phiên...'
                  : session
                    ? `${laAnDanh ? 'Phiên ẩn danh' : 'Đã liên kết tài khoản'} · ${session.user.id.slice(0, 8)}…`
                    : 'Chưa cấu hình Supabase'
              }
            />
            <Dong nhan="Đọc dữ liệu qua Row Level Security" trangthai={db} chuThich={dbChuThich} />
            <Dong
              nhan="Nội dung đọc được từ content/*.md"
              trangthai={soLieu.bai > 0 ? 'ok' : 'loi'}
              chuThich={
                soLieu.bai > 0
                  ? `${soLieu.chuong} chương · ${soLieu.bai} bài · ${soLieu.the} thẻ`
                  : 'Chưa có chương nào — chạy npm run content:build'
              }
            />
          </div>

          <Link
            to="/noi-dung"
            className="mt-4 flex items-center justify-between rounded-the-nho bg-hong-phan/20 px-4 py-3 text-sm font-medium text-hong-dam"
          >
            Xem trước nội dung đã soạn
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>

        {/* Thử luồng đăng nhập. Liên kết Google giữ nguyên user_id của phiên ẩn danh,
            nên mọi tiến độ đã có vẫn còn — đó là điểm chính cần kiểm chứng ở đây. */}
        <section className="mb-5 rounded-the bg-white/70 p-5 shadow-mem backdrop-blur-sm">
          <h2 className="mb-1 text-xl">Tài khoản</h2>

          {laAnDanh ? (
            <>
              <p className="mb-4 text-sm text-ca-cao-nhat">
                Bạn đang dùng phiên ẩn danh. Liên kết Google để giữ tiến độ khi đổi máy — mã người
                dùng không đổi, nên không mất gì.
              </p>
              <button
                onClick={bamLienKet}
                disabled={dangChuyen || !daCauHinhSupabase}
                className="flex w-full items-center justify-center gap-2.5 rounded-the-nho bg-hong-dam px-4 py-3 font-medium text-white disabled:opacity-60"
              >
                <LogIn className="size-4" aria-hidden />
                {dangChuyen ? 'Đang mở Google…' : 'Liên kết tài khoản Google'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-start gap-3">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-xanh-xo-thom" aria-hidden />
                <div className="min-w-0">
                  <p className="font-medium">Đã liên kết Google</p>
                  <p className="text-sm break-words text-ca-cao-nhat">
                    {session?.user.email ?? 'không đọc được email'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => void dangXuat()}
                className="flex w-full items-center justify-center gap-2.5 rounded-the-nho bg-hong-phan/25 px-4 py-3 font-medium text-hong-dam"
              >
                <LogOut className="size-4" aria-hidden />
                Đăng xuất
              </button>
            </>
          )}

          {loiDangNhap && (
            <p className="mt-3 rounded-the-nho bg-vang-bo/50 p-3 text-sm text-ca-cao">
              {loiDangNhap}
            </p>
          )}

          <p className="mt-3 text-xs text-ca-cao-nhat">
            Mã người dùng hiện tại: <span className="font-mono">{session?.user.id ?? '—'}</span>
          </p>
        </section>

        {/* Có dòng này thì nhìn phát biết trình duyệt đang chạy bản nào. Service
            worker từng phục vụ bundle cũ sau khi deploy mà không ai nhận ra. */}
        <p className="mb-5 text-center text-xs text-ca-cao-nhat">
          Bản đang chạy: <span className="font-mono">{__MA_BUILD__}</span> · build lúc{' '}
          {new Date(__LUC_BUILD__).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
        </p>

        <section className="rounded-the bg-white/70 p-5 shadow-mem backdrop-blur-sm">
          <h2 className="mb-1 text-xl">Bảng màu</h2>
          <p className="mb-4 text-sm text-ca-cao-nhat">
            10 màu đã chốt. Sửa ở <code className="text-hong-dam">src/styles/index.css</code>, không
            viết mã màu trong component.
          </p>
          <ul className="grid grid-cols-2 gap-2.5">
            {MAU.map(([ten, lop, ma]) => (
              <li key={ten} className="flex items-center gap-2.5 rounded-the-nho bg-white/60 p-2.5">
                <span
                  className={`${lop} size-9 shrink-0 rounded-xl ring-1 ring-ca-cao/10`}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{ten}</span>
                  <span className="block font-mono text-xs text-ca-cao-nhat">{ma}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
